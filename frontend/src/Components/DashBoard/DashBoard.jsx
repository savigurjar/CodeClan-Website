import Animate from "../../animate";
import AppLayout from "../AppLayout";
import DashboardBody from "./DashBoardBody";

const Dashboard = () => {
  return (
    <div className="relative min-h-screen bg-black">
    {/* <div> */}
   <AppLayout>
       
      <DashboardBody />
   </AppLayout>
    </div>
  );
};

export default Dashboard;
