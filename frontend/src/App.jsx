import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Overview from "./pages/Overview"
import Analytics from "./pages/Analytics"
import DashboardLayout from "./layout/DashboardLayout"
import Users from "./pages/Users"
import UserIntelligence from "./pages/UserIntelligence"
import Intelligence from "./pages/Intelligence"
import Alerts from "./pages/Alerts"
import AttackLab from "./pages/AttackLab"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserIntelligence />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/simulation" element={<AttackLab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App