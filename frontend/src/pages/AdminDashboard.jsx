// Admin home. The sidebar opens patients, appointments, the upload form, and saved records.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, getUsers, logout } from '../auth'
import { appointmentStatus, appointmentStatuses, getAppointments, profileFor, saveAppointmentStatus } from '../data/records'
import Sidebar from '../components/Sidebar'
import AppointmentDetails from '../components/AppointmentDetails'
import AdminRecords from '../components/admin/AdminRecords'
import Overview from '../components/admin/Overview'
import PatientDetails from '../components/admin/PatientDetails'
import UploadPanel from '../components/admin/UploadPanel'

const statusTone = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-[#2F6FED]/10 text-[#2F6FED]',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600',
}

const menu = [
  { id: 'overview', label: 'Overview' },
  { id: 'patients', label: 'Patients' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'upload', label: 'Upload records' },
  { id: 'records', label: 'Records' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])
  const [section, setSection] = useState('overview')
  const [openVisit, setOpenVisit] = useState(null)
  const [openPatient, setOpenPatient] = useState(null)
  // Bumps after a status change so the appointment table reads the saved value again.
  const [statusVersion, setStatusVersion] = useState(0)

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

  // The visit stores an email. The account list supplies the display name.
  const openProfile = openVisit
    ? profileFor(
        openVisit.email,
        patients.find((patient) => patient.email.toLowerCase() === openVisit.email.toLowerCase())?.name,
      )
    : null

  return (
    <main className="flex-1 bg-[#f5f9fa] px-5 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <Sidebar title="ADMIN" items={menu} active={section} onChange={setSection} />

        <div className="min-w-0 flex-1">
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

          {section === 'overview' && <Overview patients={patients} onOpen={setSection} />}

          {section === 'patients' && (
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
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.email} className="border-t border-slate-100">
                        <td className="px-5 py-3 font-medium text-slate-900">{patient.name}</td>
                        <td className="px-5 py-3 text-slate-600">{patient.email}</td>
                        <td className="px-5 py-3 text-slate-600">Patient</td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => setOpenPatient(patient)}
                            className="font-medium text-[#2F6FED]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {patients.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-5 py-6 text-slate-500">
                          No patients saved yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {section === 'appointments' && (
            <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Patient</th>
                      <th className="px-5 py-3 font-medium">Visit</th>
                      <th className="px-5 py-3 font-medium">When</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {getAppointments().map((item) => {
                      const person = patients.find((patient) => patient.email.toLowerCase() === item.email.toLowerCase())
                      return (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="px-5 py-3 font-medium text-slate-900">{person?.name || item.email}</td>
                          <td className="px-5 py-3 text-slate-600">{item.type}</td>
                          <td className="px-5 py-3 text-slate-600">{item.date} · {item.time}</td>
                          <td className="px-5 py-3">
                            <select
                              key={`${item.id}-${statusVersion}`}
                              value={appointmentStatus(item)}
                              onChange={(event) => {
                                saveAppointmentStatus(item.id, event.target.value)
                                setStatusVersion((version) => version + 1)
                              }}
                              className={`h-8 rounded-full px-3 text-xs font-medium outline-none ${statusTone[appointmentStatus(item)] || statusTone.Pending}`}
                            >
                              {appointmentStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              type="button"
                              onClick={() => setOpenVisit(item)}
                              className="font-medium text-[#2F6FED]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {section === 'upload' && (
            <div className="mt-6">
              <UploadPanel patients={patients} />
            </div>
          )}

          {section === 'records' && (
            <div className="mt-6">
              <AdminRecords />
            </div>
          )}
        </div>
      </div>

      {openPatient && <PatientDetails patient={openPatient} onClose={() => setOpenPatient(null)} />}

      {openVisit && openProfile && (
        <AppointmentDetails
          appointment={openVisit}
          profile={openProfile}
          onClose={() => setOpenVisit(null)}
        />
      )}
    </main>
  )
}
