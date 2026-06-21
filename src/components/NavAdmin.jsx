import { File, Home, Plus, MessageSquare, Users } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavAdmin = () => {
  const locator = useLocation().pathname
  
  const allnav = [
    { id: 1, title: "Initialize", icon: <Plus size={18} />, link: "/newattendance" },
    { id: 2, title: "Dashboard", icon: <Home size={18} />, link: "/admin" },
    { id: 3, title: "Roll History", icon: <File size={18} />, link: "/allattendance" },
    { id: 4, title: "Directory", icon: <Users size={18} />, link: "/memberdata" },
  ]

  return (
    <nav className="w-full sticky top-20 left-0 z-40 py-4 flex justify-center items-center">
      <div className="w-full md:max-w-[570px] mx-auto bg-gray-100/90 rounded-3xl p-1 flex justify-start items-center gap-2 border border-blue-200 overflow-x-auto no-scrollbar">
        {allnav.map((item) => {
          const isActive = locator === item.link;
          
          return (
            <Link 
              to={item.link} 
              key={item.id}
              className={`
                flex shrink-0 text-xs items-center gap-2  p-4 rounded-3xl transition-all duration-200
                ${isActive 
                  ? "bg-blue-600 text-white" 
                  : "bg-transparent text-[#44474E] hover:bg-gray-200/80"
                }
              `}
            >
              <span className={`${isActive ? "text-white" : "text-[#44474E]"}`}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default NavAdmin
