import React, { useContext,useEffect,useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import { Trash2, Calendar, Download, FileText, X, FilePlus } from 'lucide-react';
import NavAdmin from '../components/NavAdmin';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllAttendance = () => {
  const { attendance, deleteattendance, setattendancedate } = useContext(all_provider);

  const [searchatt,setsearchatt] = useState({
    year: '',
    month: '',
    week:'',
  })
  const [filtersearch,setfiltersearch] = useState([])

  useEffect(() => {
    setfiltersearch(attendance.filter(e => e.year.includes(searchatt.year) && e.month.includes(searchatt.month) && e.week.includes(searchatt.week)))
  },[searchatt])

  // --- 1. Function to download ONE specific record ---
  const downloadSingleAttendance = (att) => {
  
    const doc = new jsPDF();
    const title = `Attendance: ${att.month} ${att.week} (${att.year})`;
    
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Students: ${att.roll.length}`, 14, 22);

    const tableRows = att.roll
      .sort((a, b) => a.title.localeCompare(b.title)) 
      .map((student, index) => [
        index + 1,
        student.title,
        student.present ? "PRESENT" : "ABSENT"
      ]);

    autoTable(doc, {
      head: [['S/N', 'Name', 'Status']],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [22, 101, 52] },
    });

    doc.save(`Attendance_${att.month}_${att.week}.pdf`);
  };

  // --- 2. Function to download ALL history in one PDF ---
  const downloadAllHistory = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Complete Attendance History Report", 14, 20);

    attendance.forEach((att, index) => {
      const presentCount = att.roll.filter(p => p.present).length;
      
      autoTable(doc, {
        head: [[`${att.month} ${att.week} (${att.year})`, `Present: ${presentCount}/${att.roll.length}`]],
        body: att.roll
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(s => [s.title, s.present ? "PRESENT" : "ABSENT"]),
        startY: index === 0 ? 30 : doc.lastAutoTable.finalY + 15,
        headStyles: { fillColor: [37, 99, 235] },
      });
    });

    doc.save("Full_Attendance_History.pdf");
  };

  const handleViewRecord = (att) => {
    setattendancedate({ year: String(att.year), month: att.month, week: att.week });
  };

    const DateSelect = ({ value, set, options,type }) => (
  <select value={value} onChange={(e) => setsearchatt({...searchatt, [set]:e.target.value})} 
  className={`flex-1 ${type == 'year' ? 'rounded-l-3xl' : type == 'week' ? 'rounded-r-3xl' : ''} bg-blue-100 border-0 rounded-lg p-5 sm:py-6 px-4 text-xs font-bold capitalize outline-none`}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
  )

  return (
    <div className="min-h-screen pb-20 relative">
      <NavAdmin />
      
      <div className="max-w-5xl mx-auto p-1 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className='flex gap-3'>
            <div className="h-full bg-blue-200 p-5 rounded-xl">
            <FilePlus size={25}/>
            </div>
           <div>
             <h1 className="text-3xl font-extrabold text-gray-800 uppercase tracking-tight">Attendance History</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and export your saved records</p>
           </div>
          </div>

          <button 
            onClick={downloadAllHistory}
            disabled={attendance.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-xs rounded-2xl text-white px-6 py-5 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <FileText size={20} /> Download All (PDF)
          </button>
        </div>

        {/* search attendance */}
        <div className="w-full my-3 sticky bg-white z-20 p-3 top-40 ">
          <h1 className="text-md py-3 pl-3 text-xs">Search attendance</h1>
           <div className="w-full flex gap-3">
             <DateSelect type='year' value={searchatt.year} set={'year'}
             options={['2026', '2025']} />
            <DateSelect type='month' value={searchatt.month} set={'month'}  options={['january','february','march','april','may','june','july','august','september','october','november','december']} />
            <DateSelect type='week' value={searchatt.week} set={'week'}  options={['week 1','week 2','week 3','week 4','week 5']} />
            {searchatt.year  || searchatt.month || searchatt.week ? <button 
            onClick={() => setsearchatt({ year: '', month: '', week:'',  })}
            className="bg-red-500 text-white md:px-3 max-md:bg-white max-md:text-red-500 md:hover:bg-red-600 rounded-full text-xs flex justify-center font-semibold gap-3 items-center">
              <span className="max-md:hidden">Cancel</span>
               <X size={19}/> </button>:<> </>}
           </div>

        </div>

        <div className="grid gap-4">
          {filtersearch.length > 0 ? 
          [...filtersearch].reverse().map((att, i) => {
              const total = att.roll.length;
              const present = att.roll.filter(p => p.present === true).length;

              return (
                <motion.div 
                  key={att._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="border border-blue-100 bg-white hover:scale-102 rounded-2xl p-4 sm:py-5 flex flex-wrap items-center justify-between transition-all group"
                >
                  <div 
                    className="flex items-center gap-4 cursor-pointer flex-1 min-w-[200px]"
                    onClick={() => handleViewRecord(att)}
                  >
                    <div className="p-3 bg-green-600 rounded-xl text-white transition-colors">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 capitalize text-lg">
                        {att.month} — {att.week}
                      </h3>
                      <p className="text-sm text-gray-500">{att.year}</p>
                    </div>
                  </div>

                  <div className="max-sm:w-full flex items-center max-sm:flex-col  gap-4 mt-4 md:mt-0">
                    <div className="w-full flex justify-center gap-4 text-sm rounded-lg bg-gray-50 sm:py-5 px-4 py-2 border border-gray-100">
                      <div className="text-center">
                        <p className="text-gray-400 uppercase text-[9px] font-bold">Present</p>
                        <p className="font-bold text-green-600">{present}</p>
                      </div>
                      <div className="text-center border-l border-gray-200 pl-4">
                        <p className="text-gray-400 uppercase text-[9px] font-bold">Total</p>
                        <p className="font-bold text-gray-700">{total}</p>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center gap-1">
                      <button 
                        onClick={() => downloadSingleAttendance(att)}
                        className="p-5 w-full bg-blue-100 flex justify-center rounded-xl rounded-l-3xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Download this record"
                      >
                        <Download size={14} />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(window.confirm(`Delete ${att.month} ${att.week}?`)) {
                            deleteattendance(att._id); 
                          }
                        }}
                        className="p-5 w-full bg-red-100 flex justify-center rounded-xl rounded-r-3xl text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            }
           ): 
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white border-2 border-dashed border-gray-200"
            >
              <p className="text-gray-400">No attendance records found yet.</p>
            </motion.div>
            }
        </div>
      </div>
     
    </div>
  );
};

export default AllAttendance;
