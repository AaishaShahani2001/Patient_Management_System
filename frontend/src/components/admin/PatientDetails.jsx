// Patient popup opened from the admin patients table.
import { useEffect } from 'react'
import { getAppointments, isDemoPatient, profileFor, record } from '../../data/records'

function Field({ label, value, className = '' }) {
  return (
    <div className={`min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 ${className}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold break-words text-slate-900">{value}</p>
    </div>
  )
}

export default function PatientDetails({ patient, onClose }) {
  const profile = profileFor(patient.email, patient.name)
  const visits = getAppointments().filter((item) => item.email.toLowerCase() === patient.email.toLowerCase())
  const known = isDemoPatient(patient.email)

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <h2 className="text-xl font-semibold text-slate-900">Patient Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg text-xl leading-none text-slate-400 hover:bg-slate-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-5 pt-4 pb-5">
          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Patient Information</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Name" value={profile.name} />
              <Field label="Phone" value={profile.phone} />
              <Field label="Email" value={profile.email} className="col-span-2" />
              <Field label="Blood Group" value={profile.bloodGroup} />
              <Field label="Age" value={profile.age} />
              {known && <Field label="Patient ID" value={record.id} />}
              {known && <Field label="Allergies" value={record.allergies} />}
            </div>
            {known && (
              <div className="mt-3 flex flex-wrap gap-2">
                {record.conditions.map((item) => (
                  <span key={item} className="rounded-full bg-[#2F6FED]/10 px-3 py-1 text-xs font-medium text-[#2F6FED]">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Appointments</h3>
            {visits.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No appointments for this patient.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {visits.map((item) => (
                  <li key={item.id} className="py-2">
                    <p className="text-sm font-medium text-slate-900">{item.type}</p>
                    <p className="text-xs text-slate-500">{item.doctor} · {item.date} · {item.time}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
