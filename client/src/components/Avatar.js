import React from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { useSelector } from "react-redux";
const Avatar = ({ userID, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let AvatarName = "";

  if (name) {
    const splitName = name.split(" ");
    if (splitName > 1) {
      AvatarName = splitName[0][0] + splitName[1][0];
    } else {
      AvatarName = splitName[0][0];
    }
  }
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];
  const randomNumber = Math.floor(Math.random() * bgColor.length);

  const isOnline = onlineUser.includes(userID);
  return (
    <div
      className={`text-slate-800 shadow  relative rounded-full text-xl font-bold border ${bgColor[randomNumber]} flex justify-center`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden bg-center rounded-full bg-no-repeat"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full flex justify-center items-center"
        >
          {AvatarName}
        </div>
      ) : (
        <FaUserAstronaut
          size={width}
          className="mx-auto mt-2 overflow-hidden"
        />
      )}
      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-1 right-0 z-10  rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;
