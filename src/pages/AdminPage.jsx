import React, { useContext, useState } from 'react';
import { Check, UserPlus, Info } from 'lucide-react';
import { all_provider } from '../components/ContextProvider';
import NavAdmin from '../components/NavAdmin';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const { addnewmember, Notify } = useContext(all_provider);

  const [newdata, setnewdata] = useState({
    gender: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)    
    const surname = formData.get('surname')
    const phoneNumber = formData.get('phoneNumber')
    const firstName = formData.get('firstName')
    const middleName = formData.get('middleName')
    const dateOfBirth = formData.get('dateOfBirth')
    const emailAddress = formData.get('emailAddress')

    if (surname || firstName || phoneNumber) {
      Notify("failure", "Please fill in the required fields");
      return;
    }

    await addnewmember(
      surname, firstName, middleName, 
      phoneNumber, dateOfBirth, newdata.gender, 
      emailAddress
    );
  };

  // Helper for M3 Styled Inputs (Tonal Container Style)
  const InputField = ({ label,name, placeholder, value, onChange, type = "text", required }) => (
    <div className="flex flex-col gap-1.5">
      <label className="ml-4 text-[12px] font-medium text-[#44474E]">
        {label} {required && <span className="text-[#B3261E]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
      />
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] pb-20">
      <NavAdmin />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 mt-8"
      >
        {/* Header Section */}
        <header className="mb-10 flex items-center gap-5 px-2">
            <div className="bg-[#D3E3FD] p-4 rounded-[24px] text-[#041E49]">
                <UserPlus size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-medium text-[#1F1F1F]">Management</h1>
                <p className="text-sm text-[#44474E]">Add a new teen to the Miracle Center database</p>
            </div>
        </header>

        {/* Main Form Container (M3 Surface) */}
        <div className="bg-white rounded-[28px] p-6 md:p-10 shadow-sm border border-[#EFF2F5]">
          <div className="flex items-center gap-2 mb-8 text-[#0B57D0]">
            <Info size={18} />
            <h2 className="text-lg font-medium">Personal Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                Surname
                </label>
                <input
                  type={'text'}
                  placeholder={'Adebayo'}
                  name={'surname'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                First Name
                </label>
                <input
                  type={'text'}
                  placeholder={'Samuel'}
                  name={'firstname'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                Middle Name
                </label>
                <input
                  type={'text'}
                  placeholder={'Optional'}
                  name={'middlename'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                Phone number
                </label>
                <input
                  type={'number'}
                  placeholder={'080xxxxxxxxx'}
                  name={'phoneNumber'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                Date of Birth
                </label>
                <input
                  type={'text'}
                  placeholder={'DD/MM/YYYY'}
                  name={'dateOfBirth'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">
                Email
                </label>
                <input
                  type={'email'}
                  placeholder={'teen@gmail.com'}
                  name={'emailAddress'}
                  required
                  className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
                />
              </div>

              {/* Gender Segmented Button Group */}
              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">Gender</label>
                <div className="flex bg-[#F1F3F4] text-xs p-1 rounded-3xl border border-[#DEE2E6]">
                  {['Male', 'Female'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setnewdata({ ...newdata, gender: item })}
                      className={`flex-1 p-5 rounded-3xl text-sm font-bold transition-all ${
                        newdata.gender === item 
                        ? "bg-green-200 text-green-900" 
                        : "text-[#44474E] hover:bg-black/5"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center md:justify-end pt-8 border-t border-[#F1F3F4]">
              <button
                type="submit"
                className="w-full text-xs p-6 md:w-auto flex items-center justify-center gap-3 bg-[#0B57D0] text-white px-6 rounded-3xl font-bold hover:shadow-lg active:scale-95 transition-all"
              >
                Register Member 
                <span className="p-2 bg-white rounded-xl text-blue-600">
                  <Check size={20} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPage;
