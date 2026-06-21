import React, { useState,useContext} from 'react'
import { FastForward, Home, Key, Menu, User, Loader2Icon} from 'lucide-react'
import {motion} from "framer-motion"
import { Link, useLocation } from 'react-router-dom'
import {all_provider} from './ContextProvider.jsx'

const Navbar = () => {
  const { refresh,Notify} = useContext(all_provider);
  const [loading, setloading] = useState(false)
  const [sidebar,setsidebar]=useState(false)
  const menus = [
    {name:"Dashboard", icon:<Home className='text-blue-800' size={16}/>,link:'/'},
    {name:"Complain", icon:<User className='text-blue-800' size={16}/>, link:'/complain'},
    {name:"Admin", icon:<Key className='text-blue-800' size={16}/>, link:'/admin'},
  ]

  async function refreshpage () {
      setloading(true)
      await refresh();
      setloading(false)
  }
  const location = useLocation().pathname
  
  return (
    <>
      <div className="w-full fixed top-0 left-0 z-60 p-3 bg-gray-50/90 border border-gray-200 flex justify-between items-center">
          <div className="flex justify-center gap-3 items-center">
                {/* menu */}
              <div 
              onClick={() => setsidebar(!sidebar)}
              className="p-2 rounded-xl cursor-pointer">
                <Menu size={16} 
                className='text-gray-700/70'/>
              </div>

              <h1 className="font-semibold text-md max-sm:text-sm flex flex-col">
                Teens Attendance
                <p className='text-xs text-gray-500 max-md:hidden rounded-4xl font-semibold'>RCCG Miracle Center</p>
              </h1>
          </div>

          <div className="flex gap-1 items-center">
            {/* refresh button */}
            <motion.button
            whileHover={{scale:[1.2,1,1.1]}}
            onClick={() => refreshpage()}
            className=" p-2 flex justify-center gap-1 items-center text-gray-600 text-xs cursor-pointer duration-200" >
              <span className="max-md:hidden bg-gray-200/80 p-2 rounded-3xl rounded-r-xl">Refresh Page</span>
             <span className="bg-gray-200/80 p-2 rounded-xl max-sm:rounded-r-xl rounded-r-3xl">
              <Loader2Icon size={14} className={`${loading && 'animate-spin'}`}
             size={17}/>
             </span>
             
            </motion.button>

            {/* home button */}
            <Link to={'/'}
            className='p-3 hover:bg-green-100/90 rounded-xl duration-200'>
              <motion.div 
              className="">
                <Home className='text-green-700' size={20} />
              </motion.div>
            </Link>
            {/* Admin login */}
          <Link to={'./admin'} className="bg-blue-600 hover:bg-blue-700/80 rounded-3xl text-white font-bold p-2 px-3 hover:px-4 text-xs flex justify-between 
          items-center gap-3 cursor-pointer  duration-200">
            <span  className='max-md:hidden'>Admin Login</span>
            <div className="max-sm:hidden p-2 rounded-xl bg-white text-blue-600">
              <Key size={16} className='rotate-40'/>
            </div>
            <div className="sm:hidden">
              <Key size={16} className='rotate-40'/>
            </div>
          </Link>
          </div>
      </div>

      {/* sidebar */}
      {sidebar && 
      <div 
      onClick={() => setsidebar(false)}
      className="fixed w-full h-screen z-50 top-4 bg-gray-200/60 left-0">
          <motion.div 
          initial={{x:-100}}
          animate={{x:0}}
          className="p-2 pl-4 border-r border-gray-200 bg-white h-screen w-[250px] mt-10">
            <span className="text-sm font-semibold text-gray-500">MENU</span>

            {/* menus */}
            <div className="h-screen w-full flex flex-col mt-2">
             {menus.map((item,i) => (
              <>
                 <Link to={item.link}
                 onClick={() => setsidebar(false)}
                  className={`w-full flex justify-start p-2 py-3 rounded-md ${location == item.link && 'bg-blue-200' } items-center gap-3`}>
                {item.icon}
                <span className={`${location == item.link && 'text-blue-600'} text-xs font-semibold`}>{item.name}</span>
              </Link>
              </>
             ))}
            </div>
          </motion.div>
      </div>}
    </>
  )
}

export default Navbar