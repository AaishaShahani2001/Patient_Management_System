// Admin upload in one window. After a save, the file opens large on the right with Edit and Delete.
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addUpload, getAppointments, getUploads, removeUpload, updateUpload } from '../../data/records'

const fieldClass = 'mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900'

function emptyForm() {
  return { kind: 'prescription', appointmentId: '', title: '', note: '', file: null }
}

export default function UploadPanel({ patients }) {
  const [email, setEmail] = useState(patients[0]?.email ?? '')
  const [kind, setKind] = useState('prescription')
  const [appointmentId, setAppointmentId] = useState('')
  const [title, setTitle] = useState('')
  const [doctor, setDoctor] = useState('')
  const [scriptStatus, setScriptStatus] = useState('Active')
  const [note, setNote] = useState('')
  const [medicines, setMedicines] = useState([])
  const [medicine, setMedicine] = useState({ name: '', dose: '', frequency: '', days: '' })
  const [file, setFile] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [editingId, setEditingId] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [uploads, setUploads] = useState(() => getUploads())

  const visits = getAppointments().filter((item) => item.email.toLowerCase() === email.toLowerCase())
  // Patient medical-record uploads use kind "record" and stay off this admin list.
  const mine = uploads.filter(
    (item) => item.email.toLowerCase() === email.toLowerCase() && (item.kind === 'prescription' || item.kind === 'lab'),
  )
  // The open card is the one just saved, or the one the admin picked from the row of files.
  const selected = mine.find((item) => item.id === selectedId) ?? mine[0] ?? null

  // A lab report may be a PDF or an image. A prescription image stays an image.
  function handleFile(event) {
    const picked = event.target.files?.[0]
    if (!picked) {
      setFile(null)
      return
    }
    const pdf = picked.type === 'application/pdf' || picked.name.toLowerCase().endsWith('.pdf')
    const image = picked.type.startsWith('image/')
    if (kind === 'lab' ? !pdf && !image : !image) {
      toast.error(kind === 'lab' ? 'Choose a PDF or an image' : 'Choose an image file')
      event.target.value = ''
      return
    }
    if (picked.size > 1500000) {
      toast.error('File must be under 1.5 MB')
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFile({ name: picked.name, data: String(reader.result), type: pdf ? 'pdf' : 'image' })
    reader.readAsDataURL(picked)
  }

  function addMedicine() {
    if (!medicine.name.trim()) return
    setMedicines((current) => [
      ...current,
      {
        name: medicine.name.trim(),
        dose: medicine.dose.trim(),
        frequency: medicine.frequency.trim(),
        days: medicine.days.trim(),
      },
    ])
    setMedicine({ name: '', dose: '', frequency: '', days: '' })
  }

  function clearForm() {
    const blank = emptyForm()
    setKind(blank.kind)
    setAppointmentId(blank.appointmentId)
    setTitle(blank.title)
    setDoctor('')
    setScriptStatus('Active')
    setNote(blank.note)
    setMedicines([])
    setMedicine({ name: '', dose: '', frequency: '', days: '' })
    setFile(blank.file)
    setEditingId('')
    setFileKey((key) => key + 1)
  }

  function handleSubmit(event) {
    event.preventDefault()
    // A typed note or an image is enough. The title falls back when the admin only writes or only attaches a file.
    if (!email || (!title.trim() && !note.trim() && !file && medicines.length === 0)) {
      toast.error(kind === 'lab' ? 'Type the report or upload a PDF or image' : 'Add a medicine or upload an image')
      return
    }
    const fields = {
      email,
      kind,
      appointmentId,
      title: title.trim() || (kind === 'lab' ? 'Lab report' : `RX-${Date.now().toString().slice(-4)}`),
      doctor: doctor.trim(),
      status: kind === 'prescription' ? scriptStatus : '',
      note: note.trim(),
      medicines: kind === 'prescription' ? medicines : [],
      fileName: file?.name || '',
      fileData: file?.data || '',
      fileType: file?.type || '',
      source: 'admin',
    }

    // Edit writes over the same record. A new save is placed first and opened on the right.
    if (editingId) {
      const next = updateUpload(editingId, fields)
      setUploads(next)
      setSelectedId(editingId)
      clearForm()
      toast.success('Record updated')
      return
    }

    const next = addUpload(fields)
    setUploads(next)
    setSelectedId(next[0].id)
    clearForm()
    toast.success('Record uploaded')
  }

  // Puts the saved record back into the form so the admin can change it.
  function startEdit(item) {
    setEditingId(item.id)
    setSelectedId(item.id)
    setEmail(item.email)
    setKind(item.kind)
    setAppointmentId(item.appointmentId || '')
    setTitle(item.title === item.medicines?.[0]?.name ? '' : item.title)
    setDoctor(item.doctor || '')
    setScriptStatus(item.status || 'Active')
    setNote(item.note || '')
    setMedicines(item.medicines || [])
    setFile(item.fileData ? { name: item.fileName, data: item.fileData, type: item.fileType || (item.fileName?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image') } : null)
    setFileKey((key) => key + 1)
  }

  function handleRemove(id) {
    const next = removeUpload(id)
    setUploads(next)
    if (editingId === id) clearForm()
    if (selectedId === id) setSelectedId('')
    toast.success('Record deleted')
  }

  if (patients.length === 0) {
    return <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">No patients to upload for.</p>
  }

  return (
    // Height is the space left under the navbar, page header, and footer, so the page itself does not scroll.
    <div className="grid h-[calc(100dvh-18rem)] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col overflow-hidden border-slate-100 p-4 lg:border-r">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">{editingId ? 'Edit record' : 'Upload a record'}</h2>
          <div className="flex items-center gap-2">
            {editingId && (
              <button type="button" onClick={clearForm} className="h-9 rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-50">
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="h-9 shrink-0 rounded-lg bg-[#2F6FED] px-4 text-sm font-medium text-white hover:bg-[#2559c7]"
            >
              {editingId ? 'Save changes' : 'Save upload'}
            </button>
          </div>
        </div>

        <div className="mt-3 grid shrink-0 grid-cols-2 gap-2">
          <label className="block text-xs font-medium text-slate-500">
            Patient
            <select
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setAppointmentId('')
                setSelectedId('')
              }}
              className={fieldClass}
            >
              {patients.map((patient) => (
                <option key={patient.email} value={patient.email}>
                  {patient.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-500">
            Type
            <select value={kind} onChange={(event) => setKind(event.target.value)} className={fieldClass}>
              <option value="prescription">Prescription</option>
              <option value="lab">Lab report</option>
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-500">
            {kind === 'lab' ? 'Report name' : 'Doctor'}
            {kind === 'lab' ? (
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Blood test"
                className={fieldClass}
              />
            ) : (
              <input
                value={doctor}
                onChange={(event) => setDoctor(event.target.value)}
                placeholder="Dr. Mehta"
                className={fieldClass}
              />
            )}
          </label>

          <label className="block text-xs font-medium text-slate-500">
            Appointment
            {/* Linking a visit is what makes the image appear inside Appointment Details. */}
            <select
              value={appointmentId}
              onChange={(event) => setAppointmentId(event.target.value)}
              className={fieldClass}
            >
              <option value="">Not linked</option>
              {visits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.date} · {visit.time} · {visit.type}
                </option>
              ))}
            </select>
          </label>
        </div>

        {kind === 'prescription' ? (
          <div className="mt-2 flex min-h-0 flex-1 flex-col">
            <p className="text-xs font-medium text-slate-500">Medicines</p>
            <div className="mt-1 grid grid-cols-[1fr_0.7fr_0.8fr_0.6fr_auto] gap-1">
              <input value={medicine.name} onChange={(event) => setMedicine({ ...medicine, name: event.target.value })} placeholder="Name" className="h-8 rounded-lg border border-slate-200 px-2 text-xs" />
              <input value={medicine.dose} onChange={(event) => setMedicine({ ...medicine, dose: event.target.value })} placeholder="Dose" className="h-8 rounded-lg border border-slate-200 px-2 text-xs" />
              <input value={medicine.frequency} onChange={(event) => setMedicine({ ...medicine, frequency: event.target.value })} placeholder="How often" className="h-8 rounded-lg border border-slate-200 px-2 text-xs" />
              <input value={medicine.days} onChange={(event) => setMedicine({ ...medicine, days: event.target.value })} placeholder="Days" className="h-8 rounded-lg border border-slate-200 px-2 text-xs" />
              <button type="button" onClick={addMedicine} className="h-8 rounded-lg bg-slate-100 px-2 text-xs font-medium text-slate-700">Add</button>
            </div>
            <ul className="mt-1 min-h-0 flex-1 overflow-hidden">
              {medicines.map((item, index) => (
                <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-2 border-t border-slate-100 py-1 text-xs">
                  <span className="font-medium text-slate-900">{item.name}</span>
                  <span className="truncate text-slate-500">{[item.dose, item.frequency, item.days].filter(Boolean).join(' · ')}</span>
                  <button type="button" onClick={() => setMedicines((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 text-slate-400">Remove</button>
                </li>
              ))}
            </ul>
            <div className="mt-1 grid shrink-0 grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-500">
                Status
                <select value={scriptStatus} onChange={(event) => setScriptStatus(event.target.value)} className={fieldClass}>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="block text-xs font-medium text-slate-500">
                Note
                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Take with food"
                  className={fieldClass}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="mt-2 flex min-h-0 flex-1 flex-col text-xs font-medium text-slate-500">
            Type the lab report
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Hemoglobin 13.2 g/dL, normal"
              className="mt-1 min-h-0 w-full flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
            />
          </label>
        )}

        <div className="mt-2 flex shrink-0 items-end gap-3">
          <label className="min-w-0 flex-1 text-xs font-medium text-slate-500">
            {kind === 'lab' ? 'Or upload a PDF or image' : 'Or upload an image'}
            <input
              key={fileKey}
              type="file"
              accept={kind === 'lab' ? 'image/*,.pdf,application/pdf' : 'image/*'}
              onChange={handleFile}
              className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:h-8 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:text-sm file:text-slate-700"
            />
          </label>
          {file?.type === 'image' && (
            <img src={file.data} alt="" className="size-12 shrink-0 rounded-lg border border-slate-200 object-cover" />
          )}
          {file?.type === 'pdf' && <span className="shrink-0 text-xs text-slate-500">{file.name}</span>}
        </div>
      </form>

      <section className="flex min-h-0 flex-col p-4">
        {!selected ? (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
            The uploaded prescription or lab report will show here.
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-900">{selected.title}</p>
                <p className="text-sm text-slate-500">
                  {selected.kind === 'lab' ? 'Lab report' : 'Prescription'} · {selected.date}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(selected)}
                  className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(selected.id)}
                  className="h-9 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {selected.note && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{selected.note}</p>}
            {selected.medicines?.length > 0 && (
              <p className="mt-1 truncate text-xs text-slate-500">{selected.medicines.map((item) => item.name).join(', ')}</p>
            )}

            <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {selected.fileType === 'pdf' || selected.fileName?.toLowerCase().endsWith('.pdf') ? (
                <p className="grid h-full place-items-center px-4 text-center text-sm text-slate-500">{selected.fileName || 'PDF attached'}</p>
              ) : selected.fileData ? (
                <img src={selected.fileData} alt={selected.title} className="h-full w-full object-contain" />
              ) : (
                <p className="grid h-full place-items-center text-sm text-slate-400">No file attached</p>
              )}
            </div>

            {mine.length > 1 && (
              <div className="mt-3 flex gap-2">
                {mine.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`size-12 shrink-0 overflow-hidden rounded-lg border ${
                      item.id === selected.id ? 'border-[#2F6FED]' : 'border-slate-200'
                    }`}
                  >
                    {item.fileData && item.fileType !== 'pdf' && !item.fileName?.toLowerCase().endsWith('.pdf') ? (
                      <img src={item.fileData} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="grid size-full place-items-center bg-slate-100 text-xs text-slate-500">
                        {item.kind === 'lab' ? 'Lab' : 'Rx'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
