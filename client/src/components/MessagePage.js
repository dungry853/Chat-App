/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import uploadFile from "../helpers/uploadFile";
import { IoIosClose } from "react-icons/io";
import Loading from "./Loading";
import wallpaper from "../assets/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
const MessagePage = () => {
  const params = useParams();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  const [uploadImage, setUploadImage] = useState(null);

  const [uploadVideo, setUploadVideo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [allMessage, setAllMessage] = useState([]);
  const currMessage = useRef(null);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadImage({
          name: file?.name,
          url: reader.result,
          file: file,
        });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
    setOpenImageVideoUpload(false);
  };

  const handleUploadVideo = (e) => {
    const file = e.target.files[0];
    setLoading(true);
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadVideo({
          name: file?.name,
          url: reader?.result,
          file: file,
        });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
    setOpenImageVideoUpload(false);
  };
  useEffect(() => {
    if (uploadVideo) {
      console.log(uploadVideo);
    }
  }, [uploadVideo]);
  const handleClearUploadImage = () => {
    setUploadImage((preve) => {
      return {
        ...preve,
        url: "",
      };
    });
  };
  const handleClearUploadVideo = () => {
    setUploadVideo((preve) => {
      return {
        ...preve,
        url: "",
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };
  console.log("Params: ", params?.userID);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updatedMessage = { ...message };
    if (uploadImage?.file) {
      const uploadFilePhoto = await uploadFile(uploadImage?.file);
      updatedMessage.imageUrl = uploadFilePhoto.url;
      setUploadImage(null);
    }
    if (uploadVideo?.file) {
      console.log(uploadVideo?.file);
      const uploadFileVideo = await uploadFile(uploadVideo?.file);

      updatedMessage.videoUrl = uploadFileVideo.url;
      console.log(updatedMessage.videoUrl);
      setUploadVideo(null);
    }

    setLoading(false);

    if (
      updatedMessage.text ||
      updatedMessage.imageUrl ||
      updatedMessage.videoUrl
    ) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params.userID,
          text: updatedMessage?.text,
          imageUrl: updatedMessage?.imageUrl,
          videoUrl: updatedMessage?.videoUrl,
          msgByUserID: user?._id,
        });

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  //Fetch Data from Server side
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userID);

      socketConnection.emit("seen", params.userID);

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userID, user]);

  useEffect(() => {
    if (currMessage.current)
      currMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessage]);

  return (
    <div
      style={{ background: `url(${wallpaper})` }}
      className="bg-cover bg-no-repeat"
    >
      {" "}
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center">
        <div className="flex items-center gap-4 py-2 px-1">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={23} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userID={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2">
              {dataUser?.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary py-2 px-3">
            <HiDotsVertical size={23} />
          </button>
        </div>
      </header>
      {/* Show all Message */}
      <section className="h-[calc(100vh-128px)] relative overflow-x-hidden overflow-y-scroll scrollbar bg-slate-200 bg-opacity-30">
        {/**All Message show here*/}
        <div className="flex flex-col" ref={currMessage}>
          {allMessage?.map((msg, index) => {
            return (
              <div
                className={`p-1 mx-2  rounded-lg w-fit px-3 max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user?._id === msg.msgByUserID
                    ? "ml-auto bg-teal-100"
                    : "bg-white "
                } my-2`}
              >
                {msg?.imageUrl && (
                  <div className="w-full p-2">
                    <img
                      src={msg?.imageUrl}
                      className="size-full object-scale-down"
                    />
                  </div>
                )}

                {msg?.videoUrl && (
                  <div className="w-full p-2">
                    <video
                      src={msg?.videoUrl}
                      className="size-full object-scale-down"
                      controls
                    />
                  </div>
                )}

                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>
        {/**Upload Image Display */}
        {uploadImage?.url && (
          <div className="size-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="absolute top-0 right-0  p-2 hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoIosClose size={35} />
            </div>
            <div className="bg-white p-3">
              <img
                src={uploadImage.url}
                className="aspect-square h-full w-full max-w-sm m-2 object-scale-down"
                alt="uploadImage"
              />
            </div>
          </div>
        )}
        {/**Upload Video Display */}
        {uploadVideo?.url && (
          <div className="size-full sticky bottom-0  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="absolute top-0 right-0  p-2 hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoIosClose size={35} />
            </div>
            <div className="bg-white p-3">
              <video
                src={uploadVideo.url}
                alt="uploadVideo"
                className="aspect-square h-full w-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="size-full sticky bottom-0 bg-slate-900 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <Loading />
          </div>
        )}
      </section>
      {/***Send Message**/}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="cursor-pointer flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus />
          </button>
          {/**Video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-2 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-2 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  name="uploadImage"
                  className="hidden"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  name="uploadVideo"
                  className="hidden"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form
          className="size-full flex items-center gap-2"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none size-full"
            onChange={handleOnChange}
            value={message.text}
          />

          <button
            className="text-primary  size-11 flex justify-center items-center"
            onSubmit={handleSendMessage}
          >
            <IoMdSend size={21} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
