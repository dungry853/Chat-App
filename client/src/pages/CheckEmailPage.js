import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserAstronaut } from "react-icons/fa";
const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response?.data?.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="mt-5 flex justify-center items-center flex-col">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4  my-5">
        <div className="flex justify-center align-middle my-2">
          <FaUserAstronaut size={60} />
        </div>
        <h3 className="text-center">Welcome to Chat App!</h3>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your Email"
              className="bg-slate-100 px-2 py-1 rounded focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg rounded px-4 py-1 hover:bg-secondary hover:text-yellow-300 text-white mt-2 font-bold leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>
        <p className="my-3 text-center">
          Don't have an account ?{" "}
          <Link to={"/register"} className="hover:text-primary ">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
