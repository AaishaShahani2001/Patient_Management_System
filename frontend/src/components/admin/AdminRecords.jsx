// Admin view of the same sample record: prescriptions, lab reports, and bill status.
import { useState } from 'react'
import { bills, getPaidBillIds, getSlips, isBillPaid, labReports, prescriptions, record } from '../../data/records'

export default function AdminRecords() {
  // Read paid ids and slips once per render so a return visit shows what the patient just sent.
  const paidIds = getPaidBillIds()
  const slips = getSlips()
  const [openBill, setOpenBill] = useState(null)

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Prescriptions</h2>
          <p className="text-sm text-slate-500">{record.name} · {record.id}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Doctor</th>
                <th className="px-5 py-3 font-medium">Medicines</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((script) => (
                <tr key={script.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{script.id}</td>
                  <td className="px-5 py-3 text-slate-600">{script.doctor}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {script.medicines.map((medicine) => medicine.name).join(', ')}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{script.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Laboratory reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Report</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {labReports.map((report) => (
                <tr key={report.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{report.name}</td>
                  <td className="px-5 py-3 text-slate-600">{report.date}</td>
                  {/* Pending reports have no values yet, so the cell stays a status word. */}
                  <td className="px-5 py-3 text-slate-600">
                    {report.status === 'Ready'
                      ? report.results.map((row) => `${row.test}: ${row.value} (${row.flag})`).join('; ')
                      : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Bill</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Slip</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => {
                const paid = isBillPaid(bill, paidIds)
                return (
                  <tr key={bill.id} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{bill.title}</p>
                      <p className="text-slate-500">{bill.id}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">Rs.{bill.amount}</td>
                    <td className="px-5 py-3 text-slate-600">{paid ? 'Paid' : 'Unpaid'}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setOpenBill(bill)}
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

      {openBill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpenBill(null)
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Payment slip</h3>
              <button
                type="button"
                onClick={() => setOpenBill(null)}
                aria-label="Close"
                className="grid size-8 place-items-center rounded-lg text-xl text-slate-400 hover:bg-slate-50"
              >
                ×
              </button>
            </div>
            <p className="mt-1 font-medium text-slate-900">{openBill.title}</p>
            <p className="text-sm text-slate-500">
              {openBill.id} · Rs.{openBill.amount} · {isBillPaid(openBill, paidIds) ? 'Paid' : 'Unpaid'}
            </p>
            {slips[openBill.id] ? (
              <img
                src={slips[openBill.id].data}
                alt={`${openBill.id} payment slip`}
                className="mt-4 max-h-80 w-full rounded-lg border border-slate-200 object-contain"
              />
            ) : (
              <p className="mt-4 text-sm text-slate-400">No slip uploaded for this bill.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
