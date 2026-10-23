// Online prescriptions. Clinic uploads use the same card as the sample scripts.
import { isDemoPatient, prescriptions, uploadsFor } from '../../data/records'

function PrescriptionCard({ id, doctor, date, status, medicines, note }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{id}</p>
          <p className="text-sm text-slate-500">{doctor} · {date}</p>
        </div>
        {/* Active scripts are still in use. Completed ones are kept for the record. */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === 'Active' ? 'bg-[#2F6FED]/10 text-[#2F6FED]' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {status}
        </span>
      </div>

      {medicines.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {medicines.map((medicine) => (
            <li key={`${medicine.name}-${medicine.dose}`} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="font-medium text-slate-900">{medicine.name}</span>
              <span className="text-slate-500">
                {[medicine.dose, medicine.frequency, medicine.days].filter(Boolean).join(' · ')}
              </span>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
    </article>
  )
}

export default function PrescriptionList({ email }) {
  const scripts = isDemoPatient(email) ? prescriptions : []
  const uploaded = email ? uploadsFor(email, 'prescription') : []

  if (scripts.length === 0 && uploaded.length === 0) {
    return <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">No prescriptions yet.</p>
  }

  return (
    <section className="space-y-4">
      {uploaded.map((item) => (
        <PrescriptionCard
          key={item.id}
          id={item.title || item.id}
          doctor={item.doctor || 'Clinic'}
          date={item.date}
          status={item.status || 'Active'}
          medicines={item.medicines || []}
          note={item.note}
        />
      ))}
      {scripts.map((script) => (
        <PrescriptionCard
          key={script.id}
          id={script.id}
          doctor={script.doctor}
          date={script.date}
          status={script.status}
          medicines={script.medicines}
          note={script.note}
        />
      ))}
    </section>
  )
}
