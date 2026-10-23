// Patient home summary in one window: counts on top, four short lists underneath.
import {
  appointmentStatus,
  bills,
  getAppointments,
  getPaidBillIds,
  isBillPaid,
  isDemoPatient,
  labReports,
  prescriptions,
  record,
  uploadsFor,
} from '../../data/records'

const statusTone = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-[#2F6FED]/10 text-[#2F6FED]',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600',
}

function Stat({ label, value, hint }) {
  return (
    <article className="rounded-xl bg-white px-3 py-2 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold leading-tight text-slate-900">{value}</p>
      <p className="truncate text-[11px] text-slate-400">{hint}</p>
    </article>
  )
}

function Panel({ title, action, children }) {
  return (
    <article className="flex min-h-0 flex-col overflow-hidden rounded-xl bg-white p-3 shadow-sm">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="mt-1 min-h-0 flex-1 overflow-hidden">{children}</div>
    </article>
  )
}

const linkClass = 'text-xs font-medium text-[#2F6FED]'

export default function Overview({ email, onOpen }) {
  const visits = getAppointments().filter((item) => item.email.toLowerCase() === (email || '').toLowerCase())
  const openVisits = visits.filter((item) => {
    const status = appointmentStatus(item)
    return status === 'Pending' || status === 'Confirmed'
  })
  const paidIds = getPaidBillIds()
  const known = isDemoPatient(email)
  const scripts = [
    ...(email ? uploadsFor(email, 'prescription') : []).map((item) => ({
      id: item.id,
      label: item.title || item.id,
      detail: item.doctor || 'Clinic',
      status: item.status || 'Active',
    })),
    ...(known ? prescriptions : []).map((item) => ({
      id: item.id,
      label: item.id,
      detail: item.medicines.map((medicine) => medicine.name).join(', '),
      status: item.status,
    })),
  ]
  const reports = [
    ...(email ? uploadsFor(email, 'lab') : []).map((item) => ({
      id: item.id,
      name: item.title || 'Lab report',
      date: item.date,
      status: 'Ready',
    })),
    ...(known ? labReports : []),
  ]
  const activeScripts = scripts.filter((script) => script.status === 'Active').length
  const unpaid = bills.filter((bill) => !isBillPaid(bill, paidIds))
  const due = unpaid.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    // Height is the space left under the navbar, page header, and footer, so the page itself does not scroll.
    <div className="mt-4 flex h-[calc(100dvh-18rem)] flex-col gap-3 overflow-hidden">
      <section className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label="Patient ID" value={known ? record.id : '—'} hint={email} />
        <Stat label="Open appointments" value={openVisits.length} hint={`${visits.length} visits in total`} />
        <Stat label="Active prescriptions" value={activeScripts} hint={`${scripts.length} on file`} />
        <Stat label="Amount due" value={`Rs.${due}`} hint={`${unpaid.length} unpaid bills`} />
      </section>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-rows-2">
        <Panel
          title="Appointments"
          action={<button type="button" onClick={() => onOpen('appointments')} className={linkClass}>Open list</button>}
        >
          {openVisits.length === 0 ? (
            <p className="py-2 text-xs text-slate-500">No open appointments.</p>
          ) : (
            <ul>
              {openVisits.map((item) => {
                const status = appointmentStatus(item)
                return (
                  <li key={item.id} className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5 first:border-t-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{item.type}</p>
                      <p className="truncate text-xs text-slate-500">{item.doctor} · {item.date} · {item.time}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone[status] || statusTone.Pending}`}>
                      {status}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Payments"
          action={<button type="button" onClick={() => onOpen('payments')} className={linkClass}>Pay</button>}
        >
          <ul>
            {bills.map((bill) => {
              const paid = isBillPaid(bill, paidIds)
              return (
                <li key={bill.id} className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5 first:border-t-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{bill.title}</p>
                    <p className="text-xs text-slate-500">Rs.{bill.amount}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${paid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {paid ? 'Paid' : 'Unpaid'}
                  </span>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel
          title="Lab reports"
          action={<button type="button" onClick={() => onOpen('labs')} className={linkClass}>Open list</button>}
        >
          {reports.length === 0 ? (
            <p className="py-2 text-xs text-slate-500">No lab reports yet.</p>
          ) : (
            <ul>
              {reports.map((report) => (
                <li key={report.id} className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5 first:border-t-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{report.name}</p>
                    <p className="truncate text-xs text-slate-500">{report.date}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${report.status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {report.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Prescriptions"
          action={<button type="button" onClick={() => onOpen('prescriptions')} className={linkClass}>Open list</button>}
        >
          {scripts.length === 0 ? (
            <p className="py-2 text-xs text-slate-500">No prescriptions yet.</p>
          ) : (
            <ul>
              {scripts.map((script) => (
                <li key={script.id} className="flex items-center justify-between gap-2 border-t border-slate-100 py-1.5 first:border-t-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{script.label}</p>
                    <p className="truncate text-xs text-slate-500">{script.detail}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${script.status === 'Active' ? 'bg-[#2F6FED]/10 text-[#2F6FED]' : 'bg-slate-100 text-slate-600'}`}>
                    {script.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  )
}
