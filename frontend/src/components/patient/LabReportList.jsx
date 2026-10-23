// Laboratory report access. Ready reports can be opened. Pending ones stay closed.
import { useState } from 'react'
import { isDemoPatient, labReports, uploadsFor } from '../../data/records'

export default function LabReportList({ email }) {
  // Only one report stays open. Clicking it again closes it.
  const [openId, setOpenId] = useState(null)
  const [openUploadId, setOpenUploadId] = useState(null)
  const reports = isDemoPatient(email) ? labReports : []
  const uploaded = email ? uploadsFor(email, 'lab') : []

  function toggle(report) {
    if (report.status !== 'Ready') return
    setOpenId((current) => (current === report.id ? null : report.id))
  }

  if (reports.length === 0 && uploaded.length === 0) {
    return <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">No lab reports yet.</p>
  }

  return (
    <section className="space-y-4">
      {uploaded.map((item) => (
        <article key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-500">Uploaded · {item.date}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Ready</span>
          </div>
          {item.note && <p className="mt-3 text-sm text-slate-600">{item.note}</p>}
          {item.fileData && (
            <button
              type="button"
              onClick={() => setOpenUploadId((current) => (current === item.id ? null : item.id))}
              className="mt-3 text-sm font-medium text-[#2F6FED]"
            >
              {openUploadId === item.id ? 'Hide report' : 'View report'}
            </button>
          )}
          {openUploadId === item.id && item.fileData && (
            item.fileType === 'pdf' || item.fileName?.toLowerCase().endsWith('.pdf') ? (
              <iframe title={item.title} src={item.fileData} className="mt-3 h-72 w-full rounded-lg border border-slate-200 bg-white" />
            ) : (
              <img src={item.fileData} alt={item.title} className="mt-3 max-h-72 w-full rounded-lg border border-slate-200 object-contain" />
            )
          )}
        </article>
      ))}
      {reports.map((report) => {
        const isOpen = openId === report.id
        const isReady = report.status === 'Ready'

        return (
          <article key={report.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{report.name}</p>
                <p className="text-sm text-slate-500">{report.lab} · {report.date} · {report.id}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isReady ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {report.status}
              </span>
            </div>

            {isReady ? (
              <button
                type="button"
                onClick={() => toggle(report)}
                className="mt-4 text-sm font-medium text-[#2F6FED]"
              >
                {isOpen ? 'Hide results' : 'View results'}
              </button>
            ) : (
              <p className="mt-4 text-sm text-slate-500">This report is not ready yet.</p>
            )}

            {/* Results render only after the patient opens a ready report. */}
            {isOpen && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-2 pr-3 font-medium">Test</th>
                      <th className="py-2 pr-3 font-medium">Result</th>
                      <th className="py-2 pr-3 font-medium">Range</th>
                      <th className="py-2 font-medium">Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.results.map((row) => (
                      <tr key={row.test} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-900">{row.test}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.value}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.range}</td>
                        <td className={`py-2 ${row.flag === 'Normal' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {row.flag}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
