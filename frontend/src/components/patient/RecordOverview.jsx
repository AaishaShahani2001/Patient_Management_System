// Upload tied to one of this patient's appointments.
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addUpload, getAppointments } from '../../data/records'

export default function RecordOverview({ email }) {
  const bookings = getAppointments().filter((item) => item.email.toLowerCase() === (email || '').toLowerCase())
  const [appointmentId, setAppointmentId] = useState(bookings[0]?.id || '')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [fileKey, setFileKey] = useState(0)

  function handleFile(event) {
    const picked = event.target.files?.[0]
    if (!picked) {
      setFile(null)
      return
    }
    if (!picked.type.startsWith('image/')) {
      toast.error('Choose an image')
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

  function handleUpload(event) {
    event.preventDefault()
    if (!email || !appointmentId || !title.trim() || !file) {
      toast.error('Choose a visit, a title, and an image')
      return
    }
    // The appointment id is what Appointment Details uses to show this file.
    addUpload({
      email,
      kind: 'record',
      appointmentId,
      title: title.trim(),
      note: '',
      fileName: file.name,
      fileData: file.data,
    })
    setTitle('')
    setFile(null)
    setFileKey((key) => key + 1)
    toast.success('Uploaded to this appointment')
  }

  return (
    <form onSubmit={handleUpload} className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Upload for an appointment</h2>
        <p className="mt-1 text-sm text-slate-500">The file shows inside that visit's details.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-slate-600 sm:col-span-2">
            Appointment
            <select
              value={appointmentId}
              onChange={(event) => setAppointmentId(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900"
            >
              {bookings.length === 0 && <option value="">No appointments</option>}
              {bookings.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.date} · {item.time} · {item.type}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-slate-600 sm:col-span-2">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Scan or report name"
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-900"
            />
          </label>
          <label className="block text-sm text-slate-600 sm:col-span-2">
            Image
            <input key={fileKey} type="file" accept="image/*" onChange={handleFile} className="mt-1 block w-full text-sm" />
          </label>
        </div>
        {file && <img src={file.data} alt="" className="mt-3 max-h-40 rounded-lg border border-slate-200" />}
        <button type="submit" className="mt-4 h-10 rounded-lg bg-[#2F6FED] px-4 text-sm font-medium text-white hover:bg-[#2559c7]">
          Upload
        </button>
    </form>
  )
}
