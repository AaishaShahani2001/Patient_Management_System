// Admin home. The patient table is read from the accounts saved in localStorage.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, getUsers, logout } from '../auth'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])

  // Send anyone who is not a signed-in admin back to the admin login.
  useEffect(() => {
    const session = getSession()
    if (!session || session.role !== 'admin') {
      navigate('/admin-login', { replace: true })
      return
    }
    setUser(session)
    setPatients(getUsers().filter((account) => account.role === 'patient'))
  }, [navigate])

  // Wait until the session check finishes before painting the page.
  if (!user) return null

  // Clears the session and returns to the admin login.
  function handleLogout() {
    logout()
    navigate('/admin-login', { replace: true })
  }

  return (
    <main className="flex-1 bg-[#f5f9fa] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">ADMIN PORTAL</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Hello, {user.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        {/* Counts for patients, today's appointments, and doctors on duty. */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Patients</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{patients.length}</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Appointments today</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">4</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Doctors on duty</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">3</p>
          </article>
        </section>

        {/* Patient rows come from the accounts stored in localStorage. */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.email} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{patient.name}</td>
                    <td className="px-5 py-3 text-slate-600">{patient.email}</td>
                    <td className="px-5 py-3 text-slate-600">Patient</td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-5 py-6 text-slate-500">
                      No patients saved yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
