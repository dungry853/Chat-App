import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";
const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
        console.log("Current User Details: ", response);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserDetails();
  }, []);

  const basePath = location?.pathname === "/";

  return (
    <div className="grid md:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* {grid-template-colums: w-cột 1, w-cột 2,...} */}
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**Message Component */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg text-slate-500 mt-2">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
