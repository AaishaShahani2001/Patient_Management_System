// Patient home. The sidebar swaps the overview, visits, record, prescriptions, labs, and payments.
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../auth'
import {
  appointmentStatus,
  getAppointments,
  hideAppointment,
  profileFor,
  saveAppointmentEdit,
} from '../data/records'
import Sidebar from '../components/Sidebar'
import AppointmentDetails from '../components/AppointmentDetails'
import Overview from '../components/patient/Overview'
import RecordOverview from '../components/patient/RecordOverview'
import PrescriptionList from '../components/patient/PrescriptionList'
import LabReportList from '../components/patient/LabReportList'
import PaymentList from '../components/patient/PaymentList'

const statusTone = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-[#2F6FED]/10 text-[#2F6FED]',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600',
}

const menu = [
  { id: 'overview', label: 'Overview' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'record', label: 'Medical record' },
  { id: 'prescriptions', label: 'Prescriptions' },
  { id: 'labs', label: 'Lab reports' },
  { id: 'payments', label: 'Payments' },
]

export default function PatientDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  // Booking sends the patient here with the appointments section already open.
  const [section, setSection] = useState(location.state?.section || 'overview')
  const [openVisit, setOpenVisit] = useState(null)
  const [rows, setRows] = useState([])
  const [editingId, setEditingId] = useState('')
  const [draft, setDraft] = useState({ type: '', doctor: '', date: '', time: '' })

  // Send anyone who is not a signed-in patient back to the patient login.
  useEffect(() => {
    const session = getSession()
    if (!session || session.role !== 'patient') {
      navigate('/login', { replace: true })
      return
    }
    setUser(session)
    setRows(getAppointments().filter((item) => item.email.toLowerCase() === session.email.toLowerCase()))
  }, [navigate])

  // Wait until the session check finishes before painting the page.
  if (!user) return null

  const mine = rows

  function refreshRows() {
    setRows(getAppointments().filter((item) => item.email.toLowerCase() === user.email.toLowerCase()))
  }

  function startEdit(item) {
    // A confirmed visit stays as the admin set it.
    if (appointmentStatus(item) !== 'Pending') return
    setEditingId(item.id)
    setDraft({ type: item.type, doctor: item.doctor, date: item.date, time: item.time })
  }

  function saveEdit(event) {
    event.preventDefault()
    if (!draft.type.trim() || !draft.doctor.trim() || !draft.date.trim() || !draft.time.trim()) return
    saveAppointmentEdit(editingId, {
      type: draft.type.trim(),
      doctor: draft.doctor.trim(),
      date: draft.date.trim(),
      time: draft.time.trim(),
    })
    setEditingId('')
    refreshRows()
  }

  function removeVisit(item) {
    if (appointmentStatus(item) !== 'Pending') return
    hideAppointment(item.id)
    if (openVisit?.id === item.id) setOpenVisit(null)
    setEditingId('')
    refreshRows()
  }
  // Clears the session and returns to the patient login.
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex-1 bg-[#f5f9fa] px-5 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        <Sidebar title="PATIENT" items={menu} active={section} onChange={setSection} />

        <div className="min-w-0 flex-1">
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

          {section === 'overview' && <Overview email={user.email} onOpen={setSection} />}

          {section === 'appointments' && (
            <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>
              {mine.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No appointments yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {mine.map((item) => {
                    const status = appointmentStatus(item)
                    const canChange = status === 'Pending'
                    return (
                    <li key={item.id} className="py-3">
                      {canChange && editingId === item.id ? (
                        <form onSubmit={saveEdit} className="grid gap-2 sm:grid-cols-2">
                          <input value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} placeholder="Visit" className="h-9 rounded-lg border border-slate-200 px-3 text-sm" />
                          <input value={draft.doctor} onChange={(event) => setDraft({ ...draft, doctor: event.target.value })} placeholder="Doctor" className="h-9 rounded-lg border border-slate-200 px-3 text-sm" />
                          <input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} placeholder="Date" className="h-9 rounded-lg border border-slate-200 px-3 text-sm" />
                          <input value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} placeholder="Time" className="h-9 rounded-lg border border-slate-200 px-3 text-sm" />
                          <div className="flex gap-3 sm:col-span-2">
                            <button type="submit" className="text-sm font-medium text-[#2F6FED]">Save</button>
                            <button type="button" onClick={() => setEditingId('')} className="text-sm text-slate-500">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-900">{item.type}</p>
                              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[status] || statusTone.Pending}`}>
                                {status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">{item.doctor} · {item.date} · {item.time}</p>
                          </div>
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setOpenVisit(item)} className="text-sm font-medium text-[#2F6FED]">View</button>
                            {canChange && (
                              <>
                                <button type="button" onClick={() => startEdit(item)} className="text-sm font-medium text-slate-600">Edit</button>
                                <button type="button" onClick={() => removeVisit(item)} className="text-sm font-medium text-red-600">Delete</button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )}

          {/* These four blocks are the same components used on the record page. */}
          {section === 'record' && <div className="mt-6"><RecordOverview email={user.email} /></div>}
          {section === 'prescriptions' && <div className="mt-6"><PrescriptionList email={user.email} /></div>}
          {section === 'labs' && <div className="mt-6"><LabReportList email={user.email} /></div>}
          {section === 'payments' && <div className="mt-6"><PaymentList /></div>}
        </div>
      </div>

      {openVisit && (
        <AppointmentDetails
          appointment={openVisit}
          profile={profileFor(user.email, user.name)}
          onClose={() => setOpenVisit(null)}
        />
      )}
    </main>
  )
}
