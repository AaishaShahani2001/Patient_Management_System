// Patient home. Sample visits and records are shown after a patient login.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, logout } from '../auth'

// Sample visits shown on the patient home. They are not saved bookings yet.
const appointments = [
  { doctor: 'Dr. Mehta', type: 'General checkup', when: '24 Oct 2026, 10:30 AM', status: 'Confirmed' },
  { doctor: 'Dr. Iyer', type: 'Follow-up', when: '02 Nov 2026, 4:00 PM', status: 'Scheduled' },
]

// Sample records shown under the visit list.
const records = [
  { date: '12 Sep 2026', title: 'Blood test', note: 'Results normal' },
  { date: '03 Aug 2026', title: 'Prescription', note: 'Vitamin D, 8 weeks' },
]

export default function PatientDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  // Send anyone who is not a signed-in patient back to the patient login.
  useEffect(() => {
    const session = getSession()
    if (!session || session.role !== 'patient') {
      navigate('/login', { replace: true })
      return
    }
    setUser(session)
  }, [navigate])

  // Wait until the session check finishes before painting the page.
  if (!user) return null

  // Clears the session and returns to the patient login.
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex-1 bg-[#f5f9fa] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">PATIENT PORTAL</p>
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

        {/* Short summary cards under the welcome line. */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Patient ID</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">PMS-1001</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Upcoming visits</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{appointments.length}</p>
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Blood group</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">B+</p>
          </article>
        </section>

        {/* Upcoming visits. */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {appointments.map((item) => (
              <li key={item.when} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.type}</p>
                  <p className="text-sm text-slate-500">{item.doctor} · {item.when}</p>
                </div>
                <span className="rounded-full bg-[#2F6FED]/10 px-3 py-1 text-xs font-medium text-[#2F6FED]">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Older tests and prescriptions. */}
        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent records</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {records.map((item) => (
              <li key={item.title} className="py-3">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.date} · {item.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
