// Online payments. An unpaid bill opens a slip upload. The image is what the admin payments list shows.
import { useState } from 'react'
import toast from 'react-hot-toast'
import { bills, getPaidBillIds, getSlips, isBillPaid, payBill, saveSlip } from '../../data/records'

export default function PaymentList() {
  const [paidIds, setPaidIds] = useState(() => getPaidBillIds())
  const [slips, setSlips] = useState(() => getSlips())
  const [paying, setPaying] = useState(null)
  const [file, setFile] = useState(null)

  function handleFile(event) {
    const picked = event.target.files?.[0]
    if (!picked) {
      setFile(null)
      return
    }
    if (!picked.type.startsWith('image/')) {
      toast.error('Choose an image of the slip')
      event.target.value = ''
      return
    }
    if (picked.size > 1500000) {
      toast.error('Image must be under 1.5 MB')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFile({ name: picked.name, data: String(reader.result) })
    reader.readAsDataURL(picked)
  }

  function closePanel() {
    setPaying(null)
    setFile(null)
  }

  // Choosing Paid opens the slip panel. A bill that is already paid cannot be changed.
  function handleStatus(bill, paid, next) {
    if (paid) return
    if (next === 'Paid') setPaying(bill)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!paying || !file) {
      toast.error('Upload the payment slip')
      return
    }
    // The slip is stored first, then the bill id is marked paid.
    setSlips(saveSlip(paying.id, file))
    setPaidIds(payBill(paying.id))
    toast.success(`${paying.id} marked as paid`)
    closePanel()
  }

  const unpaidTotal = bills
    .filter((bill) => !isBillPaid(bill, paidIds))
    .reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <section className="space-y-4">
      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Amount due</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">Rs.{unpaidTotal}</p>
      </article>

      {bills.map((bill) => {
        const paid = isBillPaid(bill, paidIds)
        const slip = slips[bill.id]

        return (
          <article key={bill.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <div>
              <p className="font-medium text-slate-900">{bill.title}</p>
              <p className="text-sm text-slate-500">{bill.id} · {bill.date} · Rs.{bill.amount}</p>
            </div>
            <div className="flex items-center gap-3">
              {slip && (
                <img src={slip.data} alt="Payment slip" className="h-12 w-16 rounded-lg border border-slate-200 object-cover" />
              )}
              <select
                value={paid ? 'Paid' : 'Unpaid'}
                disabled={paid}
                onChange={(event) => handleStatus(bill, paid, event.target.value)}
                className={`h-9 rounded-full px-3 text-xs font-medium outline-none disabled:cursor-not-allowed ${
                  paid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
              {!paid && (
                <button
                  type="button"
                  onClick={() => setPaying(bill)}
                  className="h-10 rounded-lg bg-[#2F6FED] px-4 text-sm font-medium text-white transition hover:bg-[#2559c7]"
                >
                  Pay now
                </button>
              )}
            </div>
          </article>
        )
      })}

      {paying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Upload payment slip</h2>
            <p className="mt-1 text-sm text-slate-500">{paying.title} · {paying.id} · Rs.{paying.amount}</p>

            <label className="mt-4 block text-sm text-slate-600">
              Slip image
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:text-sm"
              />
            </label>

            {file && (
              <img src={file.data} alt="Slip preview" className="mt-4 max-h-48 w-full rounded-lg border border-slate-200 object-contain" />
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={closePanel} className="h-10 rounded-lg px-4 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="h-10 rounded-lg bg-[#2F6FED] px-4 text-sm font-medium text-white hover:bg-[#2559c7]">
                Submit slip
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
