// Appointment popup. Patient fields, the visit, and the uploaded report stack in one card.
import { useEffect } from 'react'
import { getUploads } from '../data/records'

function Field({ label, value, className = '' }) {
  return (
    <div className={`min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 ${className}`}>
      <p className="text-xs text-slate-400">{label}</p>
      {/* break-words keeps a long email inside its box instead of running out of the card. */}
      <p className="mt-0.5 text-sm font-semibold break-words text-slate-900">{value}</p>
    </div>
  )
}

export default function AppointmentDetails({ appointment, profile, onClose }) {
  // Files and typed notes saved against this visit, including a patient upload from the medical record.
  const reports = getUploads().filter((item) => item.appointmentId === appointment.id && (item.fileData || item.note || item.title))

  // Escape closes the popup the same way the X does.
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
          <h2 className="text-xl font-semibold text-slate-900">Appointment Details</h2>
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
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Appointment</h3>
            <p className="mt-3 text-sm font-semibold text-slate-900">
              {appointment.date} · {appointment.time}
            </p>
            <p className="mt-1 text-sm text-slate-500">{appointment.type} · {appointment.doctor}</p>
          </section>

          <section className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Uploaded Reports</h3>
            {reports.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No reports uploaded for this appointment.</p>
            ) : (
              <ul className="mt-3 space-y-4">
                {reports.map((item) => (
                  <li key={item.id}>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.kind === 'lab' ? 'Lab report' : item.kind === 'record' ? 'Patient upload' : 'Prescription'}
                      {item.fileName ? ` · ${item.fileName}` : ''}
                    </p>
                    {item.note && <p className="mt-2 text-sm text-slate-600">{item.note}</p>}
                    {item.medicines?.length > 0 && (
                      <p className="mt-1 text-sm text-slate-600">{item.medicines.map((medicine) => medicine.name).join(', ')}</p>
                    )}
                    {/* A PDF opens in the frame. An image is drawn from the saved data URL. */}
                    {item.fileData && (item.fileType === 'pdf' || item.fileName?.toLowerCase().endsWith('.pdf') ? (
                      <iframe title={item.title} src={item.fileData} className="mt-3 h-64 w-full rounded-lg border border-slate-200 bg-white" />
                    ) : (
                      <img
                        src={item.fileData}
                        alt={item.title}
                        className="mt-3 max-h-72 w-full rounded-lg border border-slate-200 bg-slate-50 object-contain"
                      />
                    ))}
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
