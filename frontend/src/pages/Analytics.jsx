import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateRiskTrend,
  generateDeviceRisk,
  generateDepartmentRisk
} from "../services/intelligenceEngine"

import RiskTrendChart from "../charts/RiskTrendChart"
import DeviceChart from "../charts/DeviceChart"
import DepartmentHeatmap from "../charts/Heatmap"

function Analytics() {

  const riskTrendData =
    generateRiskTrend(eventsMock)

  const deviceRiskData =
    generateDeviceRisk(sessionsMock, eventsMock)

  const deptRiskData =
    generateDepartmentRisk(usersMock, eventsMock)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        SOC Analytics
      </h1>

      {/* ⭐ ROW 1 */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Organizational Risk Trend
          </h2>
          <RiskTrendChart data={riskTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Device Risk Distribution
          </h2>
          <DeviceChart data={deviceRiskData} />
        </div>

      </div>

      {/* ⭐ ROW 2 */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="font-semibold text-slate-600 mb-4">
          Department Risk Heatmap
        </h2>
        <DepartmentHeatmap data={deptRiskData} />
      </div>

    </div>
  )
}

export default Analytics