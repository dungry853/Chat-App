import React from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
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
