import React, { useContext, useState } from 'react';
import { Search, Users, CheckCircle, Percent, ClipboardX, Send, Loader2, RefreshCw, CalendarDays } from 'lucide-react'; 
import Table from '../components/Table';
import { all_provider } from '../components/ContextProvider';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const { setsearch, setyear, setmonth, setweek, alldata, currentroll, attendancedate, refresh, updateattendance } = useContext(all_provider);
  const [loading, setLoading] = useState(false);

  const totalMembers = alldata?.length || 0;
  const rollData = currentroll?.roll || [];
  const presentCount = rollData.filter(p => p.present === true).length;
  const attendanceRate = totalMembers > 0 ? Math.round((presentCount / totalMembers) * 100) : 0;

  const handleSubmitRoll = async () => {
    setLoading(true);
    await updateattendance(currentroll._id, currentroll);
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full max-w-6xl mx-auto min-h-screen bg-[#F8F9FA] px-4 pb-24 pt-6"
    >
      {/* 1. HEADER SECTION (Google Style) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
            {/* Google-style Icon Logo Container */}
            <div className="bg-[#0B57D0] p-3 rounded-2xl shadow-blue-200 shadow-lg text-white">
                <CalendarDays size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-medium text-[#1F1F1F] tracking-tight">Teens Attendance</h1>
                <p className="text-sm font-medium text-[#44474E] uppercase tracking-widest">
                    {attendancedate.month} • {attendancedate.week} • {attendancedate.year}
                </p>
            </div>
        </div>
      </header>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Database" val={totalMembers} icon={<Users size={22} />} delayanimate={0} tone="blue" />
        <StatCard label="Present" val={presentCount} icon={<CheckCircle size={22} />} delayanimate={0.5} tone="green" />
        <StatCard 
          label="Attendance" 
          val={`${attendanceRate}%`} 
          icon={<Percent size={22} />} 
          tone="purple" 
          progress={attendanceRate} 
          delayanimate={0.7}
        />
      </div>

      {/* 3. SEARCH & CONTROLS (Floating Container) */}
      <div className="sticky top-20 bg-white rounded-xl p-2 md:p-3 mb-8 flex flex-col lg:flex-row gap-2">
        
        {/* Google Style Search Input */}
        <div className="relative grow group p-2">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B57D0] transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search members by name..." 
            onChange={(e) => setsearch(e.target.value)}
            className="w-full bg-blue-50 text-xs p-6 pl-14 pr-6 rounded-3xl border border-transparent focus:bg-white focus:ring-1 focus:ring-[#DEE2E6] outline-none transition-all"
          />
        </div>

        {/* Date Selectors & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-1">
          <div className="flex gap-2 w-full sm:w-auto">
            <DateSelect type="year" value={attendancedate.year} onChange={setyear} options={['2026', '2025']} />
            <DateSelect type="month" value={attendancedate.month} onChange={setmonth} options={['january','february','march','april','may','june','july','august','september','october','november','december']} />
            <DateSelect type="week" value={attendancedate.week} onChange={setweek} options={['week 1','week 2','week 3','week 4','week 5']} />
          </div>

          <button 
            onClick={handleSubmitRoll} 
            disabled={loading}
            className={`
              w-full sm:w-auto flex items-center justify-center gap-2 
              p-5 rounded-2xl font-medium text-xs transition-all
              ${loading ? "bg-gray-100 text-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md active:scale-95"}
            `}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
            <span>{currentroll?._id ? "Save Changes" : "Begin Roll"}</span>
          </button>
        </div>
      </div>

      {/* 4. CONTENT AREA */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={attendancedate.month + attendancedate.week} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[32px] overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-[#F1F3F4]"
        >
          {rollData.length > 0 ? <Table /> : <EmptyState date={attendancedate} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

/* MATERIAL 3 SUB-COMPONENTS */

const StatCard = ({ label, val, icon, tone, progress,delayanimate }) => {
  const tones = {
    blue: "bg-[#D3E3FD] text-[#041E49]",
    green: "bg-[#C4EED0] text-[#072711]",
    purple: "bg-[#EADDFF] text-[#21005D]"
  };

  return (
    <motion.div
    initial={{x:100,opacity:0.6}}
    animate={{x:0,opacity:1}}
    transition={{duration:1,delay:delayanimate}}
    className="bg-white p-6 rounded-lg border border-[#F1F3F4] flex flex-col justify-between h-32 transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${tones[tone]}`}>{icon}</div>
        <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
            <h3 className="text-2xl font-medium text-[#1F1F1F]">{val}</h3>
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full h-3 flex gap-0.5 items-center rounded-sm overflow-hidden mt-4 p-0.5">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }}  
            className="h-full rounded-sm bg-blue-600 p-0.5" 
          />
          {/* other part */}
          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${100 - progress}%` }}  
            className="h-full rounded-sm bg-blue-100 p-0.5" 
          />
        </div>
      )}
    </motion.div>
  );
};

const DateSelect = ({ value, onChange, options,type }) => (
  <div className="relative group grow sm:grow-0">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className={`appearance-none w-full bg-blue-100 rounded-xl ${type == 'year' ? 'rounded-l-3xl' : type == 'week' ? 'rounded-r-3xl' : ''} pl-5 pr-5 p-5 text-xs font-medium capitalize border-0 outline-none transition-all  cursor-pointer hover:bg-blue-200 duration-200`}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const EmptyState = ({ date }) => (
  <div className="flex flex-col items-center justify-center py-32 px-10 text-center">
    <div className="w-20 h-20 bg-[#F1F3F4] rounded-[24px] flex items-center justify-center mb-6">
      <ClipboardX size={32} className="text-gray-400" />
    </div>
    <h4 className="text-lg font-medium text-[#1F1F1F]">No Attendance Started</h4>
    <p className="text-gray-500 text-sm mt-1">
        Begin a session for {date.month} {date.week}
    </p>
  </div>
);

export default HomePage;
