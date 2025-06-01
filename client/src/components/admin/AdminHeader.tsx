import React, {  useState } from 'react'
import { IoChevronBackOutline } from "react-icons/io5";
import profile from "../../assets/user.png";
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  heading: string
}

const AdminHeader: React.FC<HeaderProps> = ({ heading }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex justify-between   space-x-10 ">
        <div className="flex mt-10 ">
          <IoChevronBackOutline className="w-8 h-8  cursor-pointer ml-3 mr-6" onClick={() => navigate(-1)} />
          <h1 className="text-3xl font-medium  -mt-0"> {heading}</h1>
        </div>
      </div>
      <hr className="border mt-3 border-gray-700" />
    </div>

  )
}

export default AdminHeader