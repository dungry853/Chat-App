import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
        const response = await axios({
          method: "get",
          url: URL,
          withCredentials: true,
        });
        dispatch(setUser(response.data.data));
        if (response.data.logout) {
          dispatch(logout());
          navigate("/email");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserDetails();
  });
  return (
    <div className="grid md:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* {grid-template-colums: w-cột 1, w-cột 2,...} */}
      <section className="bg-white">
        <Sidebar />
      </section>

      {/**Message Component */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
