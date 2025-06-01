import { User, FileText, LogOut, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userLogout } from '../../service/user/authService';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store/store';
import { logout } from '../../redux/features/authSlice';

interface IItem {
  name: string;
  icon: any;
  path: string;
  description: string;
}

const SettingsSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userid = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  const menuItems: IItem[] = [
    { name: 'Profile', icon: User, path: '/settings/profile', description: 'Personal information' },
    { name: 'Articles', icon: FileText, path: '/settings/articles', description: 'Manage your content' },
  ];

  const handleClick = (item: IItem) => {
    navigate(item.path);
  };

  const handleLogout = async () => {
    if (!userid) return
    try {
      const response = await userLogout(userid)
      if (response.success === true) {
        dispatch(logout())
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error on user logout")
    }
  }

  return (
    <div className="bg-gray-50 h-full min-h-screen w-full sm:w-72 border-r border-gray-100 shadow-sm">
      <nav className="p-4 space-y-1 pt-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className={`
                group flex items-center w-full p-3 rounded-lg text-left transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-black border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5 mr-3 transition-colors
                  ${isActive ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'}
                `}
              />
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${isActive ? 'text-gray-700' : 'text-gray-900'}`}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
              <ChevronRight
                className={`
                  w-4 h-4 transition-all duration-200
                  ${isActive
                    ? 'text-gray-500 translate-x-1'
                    : 'text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5'
                  }
                `}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
        <button className="group flex items-center w-full p-3 rounded-lg text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsSideBar;
