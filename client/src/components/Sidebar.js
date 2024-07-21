import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";

import { PiArrowUpLeftBold } from "react-icons/pi";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { logout } from "../redux/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);

      socketConnection.on("conversation", (data) => {
        // console.log("conversation", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);
  const handleLogout = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/logout`;
    try {
      const response = await axios.get(URL);
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(logout());
        navigate("/email");
        localStorage.clear();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="w-full h-full flex bg-white">
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
            onClick={() => {
              setOpenSearchUser(true);
            }}
          >
            <FaUserPlus size={25} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title={user?.name}
            onClick={() => {
              setEditUserOpen(true);
            }}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userID={user?._id}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            onClick={handleLogout}
          >
            <span className=" justify-center items-center flex">
              <RiLogoutBoxLine size={25} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800 ">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-auto overflow-y-scroll scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500">
                <PiArrowUpLeftBold size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation with.
              </p>
            </div>
          )}
          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
                key={conv?._id}
              >
                <div>
                  <Avatar
                    userID={conv?.userDetails?._id}
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={45}
                    height={45}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex gap-1">
                    {conv?.lastMsg?.imageUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaImage />
                        </span>
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </div>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <div className="flex items-center gap-1">
                        <span>
                          <FaVideo />
                        </span>
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </div>
                    )}

                    <p className="text-ellipsis line-clamp-1 w-32">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs ml-auto bg-primary text-white font-semibold rounded-full size-6  flex justify-center items-center">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/**Edit User Details**/}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {/**Search User**/}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
