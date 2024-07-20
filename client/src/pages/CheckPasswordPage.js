import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";
const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);
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
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userID: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="mt-5 flex flex-col justify-center items-center">
        <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 md:mx-auto my-5">
          <div className="w-fit mx-auto mb-2 flex flex-col justify-center items-center">
            <Avatar
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
              width={80}
              height={80}
            />
            <h2 className="text-center font-bold text-xl mt-1">
              {location?.state?.name}
            </h2>
          </div>

          <form className="grid gap-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                className="bg-slate-100 px-2 py-1 rounded focus:outline-primary"
                value={data.password}
                onChange={handleOnChange}
                required
              />
            </div>

            <button className="bg-primary text-lg rounded px-4 py-1 hover:bg-secondary hover:text-yellow-300 text-white mt-2 font-bold leading-relaxed tracking-wide">
              Login
            </button>
          </form>
          <p className="my-3 text-center font-bold">
            <Link to={"/forgot-password"} className="hover:text-primary">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
