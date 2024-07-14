import React from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  return (
    <div className="w-full h-full">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rou-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipses size={25} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="Add Friends"
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div class="flex flex-col items-center justify-center">
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title={user?.name}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <span className=" justify-center items-center flex">
              <RiLogoutBoxLine size={25} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
