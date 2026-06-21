import React, { useContext, useMemo, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import { Download, Trash2, Edit, UserX, Copy, CopyCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({ onDownload }) => {
  const { alldata, search, deletemember, updatemember,Notify } = useContext(all_provider);

  const [itemcopied,setitemcopied] = useState()

  // Filter and Sort Logic
  const displayData = useMemo(() => {
    const term = search.toLowerCase();
    let data = term 
      ? alldata.filter(m => m.surname?.toLowerCase().includes(term)) 
      : alldata;

    return [...data].sort((a, b) => (a.surname || "").localeCompare(b.surname || ""));
  }, [search, alldata]);

  const handleEdit = async (item) => {
    const surname = window.prompt("Edit Surname", item.surname);
    const firstName = window.prompt("Edit First name", item.firstName);
    const middleName = window.prompt("Edit MIddle name", item.middleName);
    const newPhone = window.prompt("Edit Phone:", item.phoneNumber);
    const newDOB = window.prompt("Edit Date of Birth (day/month/year):", item.dateOfBirth);
    const gender = window.prompt("Edit Gender",item.gender);
    const emailAddress = window.prompt("Edit email address", item.emailAddress)
    
    // Check if user didn't cancel the prompts
    if (surname,firstName,middleName,newDOB,gender,emailAddress) {
     await updatemember(item._id, { 
        surname: surname,
        firstName: firstName,
        middleName: middleName,
        phoneNumber: newPhone, 
        dateOfBirth: newDOB ,
        emailAddress: emailAddress,
        gender: gender,
      });
    }
  };

  const copydetail = async (texttocopy) => {
    setitemcopied(texttocopy)
    try {
      await navigator.clipboard.writeText(`
        surname: ${texttocopy.surname},
        firstName: ${texttocopy.firstName},
        middleName: ${texttocopy.middleName},
        phoneNumber: ${texttocopy.phoneNumber}, 
        dateOfBirth: ${texttocopy.dateOfBirth} ,
        emailAddress: ${texttocopy.emailAddress},
        gender: ${texttocopy.gender},`
      )
    } catch (e) {
      Notify('failure', 'failed to copy details')
    }
    setTimeout(() => {
      setitemcopied()
    }, 2000);
  }

  return (
    <div className="w-full p-2 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Members Directory</h2>
          <p className="text-sm text-gray-500 font-medium">
            {search.trim() ? `Found: ${displayData.length}` : `Total: ${alldata.length}`}
          </p>
        </div>
        
        <button 
          onClick={onDownload} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2.5 text-sm font-bold transition-all shadow-md active:scale-95"
        >
          <Download size={18} /> EXPORT PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 rounded-full text-left">
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">S/N</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">Full Name</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">Phone Number</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">Email Adress</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">Date of Birth</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest">Gender</th>
              <th className="p-4 text-[10px] font-black  text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode='popLayout'>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <motion.tr 
                    key={item._id || index}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="p-4 text-sm text-gray-400 font-mono">{index + 1}</td>
                    {/* Full Name */}
                    <td className="p-4 text-sm font-bold text-gray-800 uppercase">{item.surname} {item.firstName} {item.middleName}</td>
                    {/* phone Number */}
                    <td className="p-4 text-sm text-gray-500 font-medium">{item.phoneNumber || "—"}</td>
                    {/* Email */}
                    <td className="p-4 text-sm text-gray-500 font-medium">{item.emailAddress || "—"}</td>
                    {/* date of birth */}
                     <td className="p-4 text-sm text-gray-500 font-medium">{item.dateOfBirth || "—"}</td>
                    {/* Gender */}
                    <td className="p-4 text-sm text-gray-500 font-medium">{item.gender || "—"}</td>
                    <td className="p-4">
                      <div className="flex p-1 justify-end bg-gray-100/70 rounded-lg gap-1">
                        {/* copy */}
                        <button 
                           onClick={() => copydetail(item)}
                          className="p-2 text-gray-700 rounded-md bg-gray-100 hover:bg-gray-400 hover:text-white transition-colors border border-transparent"
                          title="Edit Member"
                        >
                          {itemcopied == item ? <CopyCheck size={16}/> : <Copy size={16}/>}
                        </button>
                        {/* edit */}
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-2 text-blue-600 rounded-md bg-blue-100 hover:bg-blue-600 hover:text-white transition-colors border border-transparent"
                          title="Edit Member"
                        >
                          <Edit size={16}/>
                        </button>
                        {/* delete */}
                        <button 
                          onClick={() => window.confirm(`Delete ${item.title}?`) && deletemember(item._id)}
                          className="p-2 text-red-600 rounded-md bg-red-100 hover:bg-red-600 hover:text-white transition-colors border border-transparent"
                          title="Delete Member"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <UserX size={40} />
                      <p className="text-sm font-bold uppercase tracking-widest">No members match your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CRITICAL: This was likely missing and causing your SyntaxError
export default DataTable;