import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log("uploadPhoto", uploadPhoto);
    setUploadPhoto(file);
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation(); //Ngăn chặn sự kiện tiếp tục lan truyền lên các phần tử cha.
    //Khi sử dụng: Thường được sử dụng khi bạn muốn xử lý sự kiện trên phần tử con mà không muốn sự kiện đó ảnh hưởng đến các phần tử cha.
    e.preventDefault(); //Ngăn chặn hành động mặc định của sự kiện button
    setUploadPhoto(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("data: ", data);
  };
  return (
    <div className="">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 md:mx-auto my-5">
        <h3 className="text-center">Welcome to Chat App!</h3>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your Name"
              className="bg-slate-100 px-2 py-1 rounded focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
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
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {/* {ellipsis: dùng để hiển thị ... khi văn bản quá dài, và line-clamp-1 là hiển thị số dòng khi văn bản quá dài} */}
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 mt-1 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 rounded focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary text-lg rounded px-4 py-1 hover:bg-secondary hover:text-yellow-300 text-white mt-2 font-bold leading-relaxed tracking-wide">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have account ?{" "}
          <Link to={"/email"} className="hover:text-primary ">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
