import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);
  console.log("Redux User: ", user);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
        const response = await axios({
          method: "get",
          url: URL,
          withCredentials: true,
        });
        console.log("Current User Details", response);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchUserDetails();
  });
  return (
    <div>
      Home
      {/**Message Component */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
