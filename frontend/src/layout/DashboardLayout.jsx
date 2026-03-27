import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import { Outlet } from "react-router-dom"

function DashboardLayout() {
  return (
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        <div className="flex flex-1 overflow-hidden">

          <div className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </div>

        </div>

      </div>

    </div>
  )
}

export default DashboardLayout