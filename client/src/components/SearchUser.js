import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const handleSearchUser = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
      setLoading(true);
      const Response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(Response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  console.log(searchUser);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/**Input search user**/}
        <div className="bg-white rounded h-14 flex ">
          <input
            type="text"
            placeholder="Search user by name,email,..."
            className="w-full outline-none py-1 h-full px-3 rounded"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>
        {/**Display search user**/}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/**No user found**/}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {loading && (
            <p>
              <Loading />
            </p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user, index) => {
              return (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              );
            })}
        </div>
      </div>
      <div className="absolute top-0 right-0 hover:text-white">
        <button onClick={onClose}>
          <IoIosClose size={45} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
