
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Users, Layers, Briefcase } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useEffect, useState } from 'react';
import { dashBoardStats } from '../../service/admin/dashboardSerive';
interface ISats{
users:number;
preferences:number;
articles:number
}
const AdminDashboard = () => {
  const [data,setData]=useState<ISats>()

useEffect(()=>{
  const fetchStats=async()=>{
    try {
      const response=await dashBoardStats()
      setData(response.data)
    } catch (error) {
      console.error("Error on fetching stats")
    }
  }
  fetchStats()
},[])
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className='flex-1'>
        <AdminHeader heading='Dashboard' />
        <div className="flex-1 p-6">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Users size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h2 className="text-xl font-semibold text-gray-800">{data?.users}</h2>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <Layers size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Preferences</p>
                <h2 className="text-xl font-semibold text-gray-800">{data?.preferences}</h2>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                <Briefcase size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Articles </p>
                <h2 className="text-xl font-semibold text-gray-800">{data?.articles}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
