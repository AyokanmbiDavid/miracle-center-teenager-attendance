import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';

export const all_provider = createContext();

const api = axios.create({
  baseURL: "https://teens-attendance-backend.onrender.com/api",
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const ContextProvider = ({ children }) => {
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  
  // Upgraded IndexedDB hooks preserved for robust offline performance
  const [alldata, setalldata, membersReady] = useIndexedDB("members", []);
  const [attendance, setattendance, attendanceReady] = useIndexedDB("attendance", []);
  
  const [currentroll, setcurrentroll] = useState({ roll: [] });
  
  const [attendancedate, setattendancedate] = useState(() => 
    JSON.parse(localStorage.getItem('attendancedate')) || { year: "2026", month: "march", week: "week 1" }
  );

  const [notifystatus, setnotifystatus] = useState({ type: "", message: "", show: false });

  const Notify = (type, message) => {
    setnotifystatus({ type, message, show: true });
    if (type !== "loading") setTimeout(() => setnotifystatus({ type: "", message: "", show: false }), 3000);
  };

  const closenotify = () => setnotifystatus({ type: "", message: "", show: false });

  // 1. Fetch Members Target (Clean Array)
  const fetchMembers = useCallback(async () => {
    try {
      Notify("loading", 'updating member directory');
      const mRes = await api.get('/members');
      setalldata(mRes.data);
      Notify("success", "members updated");
    } catch (err) {
      console.error("Member sync failed.", err.message);
      Notify('failure', 'could not update members');
    }
  }, []);

  // 2. Fetch Attendance Target (Fetches full list, no page limit counters)
  const fetchAttendance = useCallback(async () => {
    try {
      Notify("loading", 'updating attendance history');
      const aRes = await api.get('/attendance');
      
      // Handle either wrapped data payloads or plain array streams safely
      const fetchedHistory = aRes.data.data || aRes.data; 
      setattendance(fetchedHistory);
      
      Notify("success", "attendance updated");
    } catch (err) {
      console.error("Attendance data synced.", err.message);
      Notify('failure', 'could not update attendance');
    }
  }, []);

  // 3. Combined Refresh Core Action
  const fetchEverything = useCallback(async () => {
    try {
      Notify("loading", 'syncing all data...');
      const [mRes, aRes] = await Promise.all([
        api.get('/members'),
        api.get('/attendance')
      ]);

      setalldata(mRes.data);
      setattendance(aRes.data.data || aRes.data);
      
      Notify("success", "Connected");
    } catch (err) {
      console.error("Full sync failed.", err.message);
      Notify('failure', 'network sync failed');
    }
  }, []);

  // Initial Startup Run
  useEffect(() => {
    if (membersReady && attendanceReady) {
      fetchEverything();
    }
  }, [membersReady, attendanceReady]);

  // Synchronize Active Calendar Dropdown Matches
  useEffect(() => {
    const found = attendance.find(att => 
      String(att.year) === String(attendancedate.year) && 
      att.month === attendancedate.month && 
      att.week === attendancedate.week
    );
    setcurrentroll(found || { roll: [] });
    localStorage.setItem('attendancedate', JSON.stringify(attendancedate));
  }, [attendancedate, attendance]);

  // Handle Frontend Search Filtering
  useEffect(() => {
    const res = (currentroll?.roll || []).filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    setsearchresult(res);
  }, [search, currentroll]);

  // Member Action Mutations
  const addnewmember = async (surname, firstName, middleName, phoneNumber, dateOfBirth, gender, emailAddress) => {
    Notify("loading", "Adding new member");
    const findmember = alldata.find(e => e.surname == surname && e.firstName == firstName && e.middleName == middleName);

    if (!findmember) {
      try {
        await api.post('/members', { surname, firstName, middleName, phoneNumber, dateOfBirth, gender, emailAddress });
        await fetchMembers(); 
        Notify("success", "New Member Added");
      } catch (err) { 
        Notify("failure", "Failed to add member");
        console.error(err);
      } 
    } else {
      Notify('failure', 'Member data already registered');
    }
  };

  const updatemember = async (id, data) => {
    Notify("loading", "Updating...");
    try {
      await api.put(`members/${id}`, data);
      await fetchMembers(); 
      Notify("success", "member data updated");
    } catch (err) { Notify("failure", "Failed"); console.error(err); }
  };

  const deletemember = async (id) => {
    Notify("loading", "Deleting...");
    try {
      await api.delete(`/members/${id}`);
      await fetchMembers(); 
      Notify("success", "Member Deleted");
    } catch (err) { Notify("failure", "Failed to delete member"); console.error(err); }
  };

  const markattendance = (memberId, status) => {
    setcurrentroll(prev => ({
      ...prev,
      roll: (prev.roll || []).map(p => 
        (p.memberId === memberId || p.id === memberId) ? { ...p, present: status } : p
      )
    }));
  };

  // Attendance Action Mutations
  const createattendance = async (year, month, week) => {
    Notify("loading", "Creating New Attendance");
    const findattendance = attendance.find(e => e.year == year && e.week == week && e.month == month);
    if (!findattendance) {
      try {
        await api.post('/attendance', { year, month, week });
        await fetchAttendance(); 
        Notify('success', "new attendance created");
      } catch (error) {
        Notify("failure", "failed to create attendance");
      } 
    } else {
      Notify('failure', 'Attendance had been created');
    }
  };

  const updateattendance = async (_id, alldata) => {
    try {  
      await api.put(`/attendance/mark/${_id}`, alldata);
      await fetchAttendance(); 
      Notify('success', "Attendance submitted");
    } catch (err) {
      Notify("failure", "Failed to submit attendance");
      console.error(err);
    }
  };

  const deleteattendance = async (id) => {
    Notify("loading", "Deleting...");
    try {
      await api.delete(`/attendance/${id}`);
      await fetchAttendance(); 
      Notify("success", "Attendance deleted successfully");
    } catch (err) { Notify("failure", "Error"); console.error(err); }
  };

  return (
    <all_provider.Provider value={{
      alldata, attendance, currentroll, search, setsearch, searchresult, 
      attendancedate, setattendancedate,
      setyear: (val) => setattendancedate(prev => ({ ...prev, year: val })),
      setmonth: (val) => setattendancedate(prev => ({ ...prev, month: val })),
      setweek: (val) => setattendancedate(prev => ({ ...prev, week: val })),
      addnewmember, updatemember, deletemember, markattendance, createattendance, deleteattendance,
      updateattendance,
      Notify, notifystatus, closenotify, 
      refresh: fetchEverything 
    }}>
      {children}
    </all_provider.Provider>
  );
};

export default ContextProvider;
