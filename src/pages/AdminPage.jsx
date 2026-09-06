import React, { useContext, useState, useRef } from 'react';
import { Check, UserPlus, Info, Wand2 } from 'lucide-react';
import { all_provider } from '../components/ContextProvider';
import NavAdmin from '../components/NavAdmin';
import { motion } from 'framer-motion';

const AdminPage = () => {
  const { addnewmember, Notify } = useContext(all_provider);
  const formRef = useRef(null) // To access inputs directly

  const [newdata, setnewdata] = useState({
    gender: '',
  });

  // Generate random placeholder
  const generateValue = (type) => {
    const timestamp = Date.now().toString().slice(-5)
    if (type === 'phone') return `080000${timestamp}`
    if (type === 'email') return `pending${timestamp}@temp.com`
    if (type === 'middle') return `N/A`
  }

  // This just sets the input value
  const handleSetRandom = (fieldName, type) => {
    const input = formRef.current.elements[fieldName]
    if (input) {
      input.value = generateValue(type)
      input.focus() // so user sees it filled
      Notify("info", `${label} auto-filled`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    const surname = formData.get('surname')
    const phoneNumber = formData.get('phoneNumber')
    const firstName = formData.get('firstName')
    const middleName = formData.get('middleName')
    const dateOfBirth = formData.get('dateOfBirth')
    const emailAddress = formData.get('emailAddress')

    if (!surname ||!firstName ||!newdata.gender) {
      Notify("failure", "Please fill Surname, First Name and Gender");
      return;
    }

    await addnewmember(
      surname, firstName, middleName,
      phoneNumber, dateOfBirth, newdata.gender,
      emailAddress
    );

    Notify("success", "Member added successfully");
    e.target.reset();
    setnewdata({ gender: '' })
  };

  const InputField = ({ label, name, placeholder, type = "text", required, showButton, buttonType }) => (
    <div className="flex flex-col gap-1.5">
      <label className="ml-4 text-[12px] font-medium text-[#44474E]">
        {label} {required && <span className="text-[#B3261E]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        required={required}
        className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white border-b-2 border-transparent focus:border-[#0B57D0] rounded-2xl p-5 text-xs transition-all outline-none"
      />

      {showButton && (
        <button
          type="button" // important: not submit
          onClick={() => handleSetRandom(name, buttonType)}
          className="flex items-center gap-2 w-fit text-[11px] text-[#0B57D0] bg-[#E8F0FE] px-3 py-1.5 rounded-xl hover:bg-[#D3E3FD] transition-all mt-1 ml-2"
        >
          <Wand2 size={14} /> Not Provided
        </button>
      )}
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
        <header className="mb-10 flex items-center gap-5 px-2">
            <div className="bg-[#D3E3FD] p-4 rounded-[24px] text-[#041E49]">
                <UserPlus size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-medium text-[#1F1F1F]">Management</h1>
                <p className="text-sm text-[#44474E]">Add a new teen to the Miracle Center database</p>
            </div>
        </header>

        <div className="bg-white rounded-[28px] p-6 md:p-10 shadow-sm border border-[#EFF2F5]">
          <div className="flex items-center gap-2 mb-8 text-[#0B57D0]">
            <Info size={18} />
            <h2 className="text-lg font-medium">Personal Information</h2>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">

              <InputField label="Surname" name="surname" placeholder="Adebayo" required />
              <InputField label="First Name" name="firstName" placeholder="Samuel" required />

              <InputField
                label="Middle Name"
                name="middleName"
                placeholder="Optional"
                showButton={true}
                buttonType="middle"
              />

              <InputField
                label="Phone number"
                name="phoneNumber"
                placeholder="080xxxxxxxxx"
                type="tel"
                showButton={true}
                buttonType="phone"
              />

              <InputField label="Date of Birth" name="dateOfBirth" type="date" />

              <InputField
                label="Email"
                name="emailAddress"
                placeholder="teen@gmail.com"
                type="email"
                showButton={true}
                buttonType="email"
              />

              <div className="flex flex-col gap-1.5">
                <label className="ml-4 text-[12px] font-medium text-[#44474E]">Gender <span className="text-[#B3261E]">*</span></label>
                <div className="flex bg-[#F1F3F4] text-xs p-1 rounded-3xl border-[#DEE2E6]">
                  {['Male', 'Female'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setnewdata({...newdata, gender: item })}
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
