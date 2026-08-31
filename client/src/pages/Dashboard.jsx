import UserDashboard from './dashboards/UserDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Navigate } from 'react-router-dom';



export default function Dashboard() {

  const dashboards = {
    admin: <AdminDashboard />,
    staff: <StaffDashboard />,
    user: <UserDashboard />
  }

  const user = localStorage.getItem('user');
  if(user){
    const role = JSON.parse(user).role;
    return dashboards[role] || <UserDashboard />;
    

  } else {
    //redirect for now maybe somegthing else later
    console.log('No user found');
    return <Navigate to="/" />
  }
}