import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { userLogout } from "../../service/user/authService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store/store";
import { logout } from "../../redux/features/authSlice";

const menuItems = [
    { icon: <IoHomeOutline className="w-6 h-6" />, label: "Feed", path: "/admin/dashboard" },
    { icon: <FaUsers className="w-6 h-6" />, label: "Users", path: "/admin/users" },
    { icon: <MdCategory className="w-6 h-6" />, label: "Preferences", path: "/admin/preferences" },
    { divider: true },
    { icon: <IoLogOutOutline className="w-6 h-6" />, label: "Logout", path: "/logout" },
];

export const AdminSidebar = () => {
    const [selected, setLocalSelected] = useState<string | undefined>("Feed");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const currentItem = menuItems.find((item) => item.path === location.pathname);
        if (currentItem) {
            setLocalSelected(currentItem.label);
        }
    }, [location]);
    const userId = useSelector((state: RootState) => state.auth.user)
    const dispatch=useDispatch<AppDispatch>()
    const handleSelect = async (label?: string, path?: string) => {
        try {
            if (label && path) {
                if(!userId) return
                setLocalSelected(label);
                if (label === "Logout") {
                    const response = await userLogout(userId)
                    if (response) {
                        dispatch(logout())
                        navigate("/login")
                    }
                } else {
                    navigate(path);
                }
            }
        } catch (error) {

        }

    };

    return (
        <div className='bg-gra-50 border-r w-1/6 h-screen px-3' style={{ fontFamily: "DM Sans, sans-serif" }}>
            <div className="p-5 mt-5 px-10">
                <h1 className="font-bold text-2xl sm:text-3xl" onClick={() => navigate('/')}>
                    feedin.
                </h1>
            </div>
            <div className="mt-6 space-y-4 p-4">
                {menuItems.map((item, index) => (
                    item.divider ? <hr key={index} className="my-2 w-full" /> : (
                        <div
                            key={index}
                            className={`relative flex items-center space-x-4 cursor-pointer p-3 rounded-md ${selected === item.label ? 'bg-gray-200 text-black' : 'hover:bg-gray-200/80'}`}
                            onClick={() => handleSelect(item.label, item.path)}
                        >
                            {selected === item.label && <span className="absolute right-44 top-0 h-full w-2 bg-black rounded"></span>}
                            {item.icon}
                            <h4 className="text-lg pl-3">{item.label}</h4>
                        </div>
                    )
                ))}
            </div>


        </div>
    );
};

export default AdminSidebar