import { IoIosSearch } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import profileAvathar from "../../assets/user.png"
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const profileImage = useSelector((state: RootState) => state.auth.profileImage)
  const navigate = useNavigate()
  const handeleLogginBtn = () => navigate("/login")
  const handlePofileBtn = () => navigate("/settings/profile")
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery(""); 
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-6 md:px-20 pt-5 sm:pt-7 bg-gray-50">
      <div>
        <h1 className="font-bold text-2xl sm:text-3xl" onClick={() => navigate('/')}>
          feedin.
        </h1>
      </div>
      <div className="flex space-x-4 sm:space-x-6 items-center">
        <IoMdCreate className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" onClick={() => navigate("/add-article")} />
        <div>
          <form onSubmit={handleSearch} className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Search articles..."
              className="outline-none text-sm sm:text-base bg-transparent w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <IoIosSearch className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </form>
        </div>
        <div className="relative   w-9 h-9 sm:w-20 sm:h-10  border-gray-800 rounded-md overflow-hidden flex items-center justify-center">
          {user ? (
            <button
              onClick={handlePofileBtn}
              className="focus:outline-none"
            >
              <img
                src={profileImage || profileAvathar}
                alt="Profile"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-800 object-cover transition-transform duration-200 hover:scale-105"
              />
            </button>
          ) : (
            <button
              onClick={handeleLogginBtn}
              className="px-3 py-1 text-sm sm:text-base bg-black text-white rounded-md font-semibold "
            >
              Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;
