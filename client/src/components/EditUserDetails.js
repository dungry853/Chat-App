import React, { useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios";
import uploadFile from "../helpers/uploadFile";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   setData((prev) => {
  //     return {
  //       ...prev,
  //       ...user,
  //     };
  //   });
  // }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    uploadPhotoRef.current.click();
  };
  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPhoto({
          name: file?.name,
          url: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
    try {
      const uploadFilePhoto = await uploadFile(uploadPhoto?.file);
      let updatedUserData = { ...data };
      updatedUserData.profile_pic = uploadFilePhoto.url;
      console.log(updatedUserData);

      const Response = await axios({
        method: "POST",
        url: URL,
        data: updatedUserData,
        withCredentials: true,
      });
      toast.success(Response.data.message);
      console.log(Response.data);
      if (Response.data.success) {
        dispatch(setUser(Response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit User Details</p>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="my-1 flex items-center flex-col gap-3">
            <Avatar
              name={data?.name}
              imageUrl={uploadPhoto?.url ? uploadPhoto?.url : data?.profile_pic}
              width={80}
              height={80}
            />
            <label htmlFor="profile_pic">
              <button className="font-semibold" onClick={handleOpenUploadPhoto}>
                Change Photo
              </button>

              <input
                type="file"
                className="hidden"
                name="profile_pic"
                id="profile_pic"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </label>
          </div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={data?.name}
            onChange={handleOnChange}
            className="focus:outline-primary w-full py-1 px-2 border rounded"
          />
          <Divider />
          <div className="flex ml-auto gap-2 w-fit">
            <button
              onClick={onClose}
              className="border-primary border px-4 py-1 rounded text-primary hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              onSubmit={handleSubmit}
              className="border-orange-500 border px-4 py-1 rounded text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
