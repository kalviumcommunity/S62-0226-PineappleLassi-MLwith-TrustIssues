function UserProfileCard({ user }) {

  return (
    <div className="bg-white p-6 rounded-2xl shadow mb-6">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
          {user.user_id.slice(-2)}
        </div>

        <div>
          <div className="font-semibold text-lg">
            {user.user_id}
          </div>
          <div className="text-slate-400 text-sm">
            {user.role} · {user.department}
          </div>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

        <div>
          <div className="text-slate-400">Variability</div>
          <div className="font-semibold">
            {user.behavior_variability_score}
          </div>
        </div>

        <div>
          <div className="text-slate-400">Privilege</div>
          <div className="font-semibold">
            {user.privilege_level}
          </div>
        </div>

      </div>

    </div>
  )
}

export default UserProfileCard