// Sample electronic record for the demo patient (patient@medicare.com).
// Paid bills that the patient pays online are stored separately in localStorage.

const PAID_KEY = 'medicarePaidBills'
const SLIPS_KEY = 'medicarePaymentSlips'
const UNPAID_KEY = 'medicareUnpaidBills'

export const record = {
  id: 'PMS-1001',
  name: 'Riya Sharma',
  email: 'patient@medicare.com',
  phone: '0771234567',
  age: 28,
  bloodGroup: 'B+',
  allergies: 'Penicillin',
  conditions: ['Vitamin D deficiency', 'Seasonal allergy'],
}

// Visits the admin can open. The demo patient owns every row.
export const appointments = [
  { id: 'APT-101', email: 'patient@medicare.com', doctor: 'Dr. Mehta', type: 'General checkup', date: '24/10/2026', time: '10:30', status: 'Pending' },
  { id: 'APT-102', email: 'patient@medicare.com', doctor: 'Dr. Iyer', type: 'Follow-up', date: '2/11/2026', time: '16:00', status: 'Pending' },
  { id: 'APT-103', email: 'patient@medicare.com', doctor: 'Dr. Mehta', type: 'Lab review', date: '18/10/2026', time: '09:30', status: 'Pending' },
  { id: 'APT-104', email: 'patient@medicare.com', doctor: 'Dr. Iyer', type: 'Allergy follow-up', date: '12/9/2026', time: '08:30', status: 'Completed' },
  { id: 'APT-105', email: 'patient@medicare.com', doctor: 'Dr. Mehta', type: 'Vitamin D review', date: '3/8/2026', time: '08:30', status: 'Completed' },
]

export const visits = [
  {
    date: '12 Sep 2026',
    doctor: 'Dr. Mehta',
    reason: 'General checkup',
    note: 'Vitamin D was low. A blood test and an 8-week course were advised.',
  },
  {
    date: '03 Aug 2026',
    doctor: 'Dr. Iyer',
    reason: 'Allergy follow-up',
    note: 'Symptoms had improved. The short antihistamine course was completed.',
  },
]

export const prescriptions = [
  {
    id: 'RX-2401',
    date: '12 Sep 2026',
    doctor: 'Dr. Mehta',
    status: 'Active',
    note: 'Take the vitamin with food. Review after 8 weeks.',
    medicines: [
      { name: 'Vitamin D3', dose: '60,000 IU', frequency: 'Once a week', days: '8 weeks' },
      { name: 'Calcium', dose: '500 mg', frequency: 'Once daily', days: '8 weeks' },
    ],
  },
  {
    id: 'RX-2318',
    date: '03 Aug 2026',
    doctor: 'Dr. Iyer',
    status: 'Completed',
    note: 'Finish the course even if the itching stops.',
    medicines: [
      { name: 'Cetirizine', dose: '10 mg', frequency: 'Once at night', days: '10 days' },
    ],
  },
]

export const labReports = [
  {
    id: 'LAB-118',
    date: '12 Sep 2026',
    name: 'Complete blood count',
    lab: 'MediCare Lab',
    status: 'Ready',
    results: [
      { test: 'Hemoglobin', value: '13.2 g/dL', range: '12.0 – 15.5', flag: 'Normal' },
      { test: 'WBC', value: '7.4 x10^9/L', range: '4.0 – 11.0', flag: 'Normal' },
      { test: 'Platelets', value: '210 x10^9/L', range: '150 – 450', flag: 'Normal' },
    ],
  },
  {
    id: 'LAB-104',
    date: '12 Sep 2026',
    name: 'Vitamin D',
    lab: 'MediCare Lab',
    status: 'Ready',
    results: [
      { test: '25-OH Vitamin D', value: '18 ng/mL', range: '30 – 100', flag: 'Low' },
    ],
  },
  {
    id: 'LAB-121',
    date: '18 Oct 2026',
    name: 'Allergy panel',
    lab: 'MediCare Lab',
    status: 'Pending',
    results: [],
  },
]

// status "Paid" is already settled. "Unpaid" can be paid from the patient page.
export const bills = [
  { id: 'BILL-501', date: '12 Sep 2026', title: 'Consultation · Dr. Mehta', amount: 800, status: 'Paid' },
  { id: 'BILL-502', date: '12 Sep 2026', title: 'Blood test', amount: 650, status: 'Unpaid' },
  { id: 'BILL-503', date: '18 Oct 2026', title: 'Allergy panel', amount: 900, status: 'Unpaid' },
]

// Bill ids the patient has paid in this browser.
export function getPaidBillIds() {
  try {
    const raw = localStorage.getItem(PAID_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function readIdList(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Bills the patient set back to unpaid, including a sample row that started as Paid.
export function getUnpaidOverrides() {
  return readIdList(UNPAID_KEY)
}

// A sample bill that starts as Paid, or one the patient just paid, both count as paid.
// An unpaid choice from the patient wins over the sample status.
export function isBillPaid(bill, paidIds = getPaidBillIds()) {
  if (getUnpaidOverrides().includes(bill.id)) return false
  return bill.status === 'Paid' || paidIds.includes(bill.id)
}

// Saves the id and returns the full paid list so the page can refresh its badges.
export function payBill(id) {
  const unpaid = getUnpaidOverrides().filter((item) => item !== id)
  localStorage.setItem(UNPAID_KEY, JSON.stringify(unpaid))
  const paid = getPaidBillIds()
  if (!paid.includes(id)) {
    paid.push(id)
    localStorage.setItem(PAID_KEY, JSON.stringify(paid))
  }
  return paid
}

// Drops the paid mark and the slip so the bill shows as unpaid for the patient and the admin.
export function markUnpaid(id) {
  const unpaid = getUnpaidOverrides()
  if (!unpaid.includes(id)) unpaid.push(id)
  localStorage.setItem(UNPAID_KEY, JSON.stringify(unpaid))
  const paid = getPaidBillIds().filter((item) => item !== id)
  localStorage.setItem(PAID_KEY, JSON.stringify(paid))
  const slips = getSlips()
  delete slips[id]
  localStorage.setItem(SLIPS_KEY, JSON.stringify(slips))
  return { paid, slips }
}

// Payment slip images, keyed by bill id. The value is { name, data }.
export function getSlips() {
  try {
    const raw = localStorage.getItem(SLIPS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveSlip(billId, slip) {
  const slips = getSlips()
  slips[billId] = slip
  localStorage.setItem(SLIPS_KEY, JSON.stringify(slips))
  return slips
}

const UPLOADS_KEY = 'medicareUploads'
const STATUS_KEY = 'medicareAppointmentStatus'
const APPOINTMENT_EDITS_KEY = 'medicareAppointmentEdits'
const APPOINTMENT_HIDDEN_KEY = 'medicareHiddenAppointments'
const BOOKED_KEY = 'medicareBookedAppointments'

function readObject(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Visits booked from the doctor page, newest first.
export function getBookedAppointments() {
  try {
    const raw = localStorage.getItem(BOOKED_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Saves one visit for the signed-in patient so both dashboards can list it.
export function bookAppointment(item) {
  const booked = getBookedAppointments()
  booked.unshift({
    id: `APT-${Date.now()}`,
    status: 'Pending',
    ...item,
  })
  localStorage.setItem(BOOKED_KEY, JSON.stringify(booked))
  return booked[0]
}

// Sample visits plus booked ones, with edits applied and deleted rows left out.
export function getAppointments() {
  const edits = readObject(APPOINTMENT_EDITS_KEY)
  let hidden = []
  try {
    const raw = localStorage.getItem(APPOINTMENT_HIDDEN_KEY)
    hidden = raw ? JSON.parse(raw) : []
  } catch {
    hidden = []
  }
  return [...getBookedAppointments(), ...appointments]
    .filter((item) => !hidden.includes(item.id))
    .map((item) => ({ ...item, ...(edits[item.id] || {}) }))
}

export function saveAppointmentEdit(id, changes) {
  const edits = readObject(APPOINTMENT_EDITS_KEY)
  edits[id] = { ...(edits[id] || {}), ...changes }
  localStorage.setItem(APPOINTMENT_EDITS_KEY, JSON.stringify(edits))
  return getAppointments()
}

export function hideAppointment(id) {
  let hidden = []
  try {
    const raw = localStorage.getItem(APPOINTMENT_HIDDEN_KEY)
    hidden = raw ? JSON.parse(raw) : []
  } catch {
    hidden = []
  }
  if (!hidden.includes(id)) hidden.push(id)
  localStorage.setItem(APPOINTMENT_HIDDEN_KEY, JSON.stringify(hidden))
  return getAppointments()
}

export const appointmentStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

// Saved choices override the sample status on that visit.
export function appointmentStatus(appointment) {
  try {
    const raw = localStorage.getItem(STATUS_KEY)
    const saved = raw ? JSON.parse(raw) : {}
    return saved[appointment.id] || appointment.status
  } catch {
    return appointment.status
  }
}

export function saveAppointmentStatus(id, status) {
  let saved = {}
  try {
    const raw = localStorage.getItem(STATUS_KEY)
    saved = raw ? JSON.parse(raw) : {}
  } catch {
    saved = {}
  }
  saved[id] = status
  localStorage.setItem(STATUS_KEY, JSON.stringify(saved))
}

// Name, phone, age, and blood group shown inside Appointment Details.
export function profileFor(email, name) {
  if (email?.toLowerCase() === record.email) {
    return {
      name: name || record.name,
      email: record.email,
      phone: record.phone,
      bloodGroup: record.bloodGroup,
      age: record.age,
    }
  }
  return { name: name || 'Patient', email, phone: '—', bloodGroup: '—', age: '—' }
}

export function isDemoPatient(email) {
  return !email || email.toLowerCase() === record.email
}

// Prescription and lab images the admin has saved in this browser.
export function getUploads() {
  try {
    const raw = localStorage.getItem(UPLOADS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function uploadsFor(email, kind) {
  return getUploads().filter(
    (item) => item.email.toLowerCase() === email.toLowerCase() && (!kind || item.kind === kind),
  )
}

// Newest upload is kept first so it shows at the top of the lists.
export function addUpload(item) {
  const uploads = getUploads()
  uploads.unshift({
    id: `UP-${Date.now()}`,
    date: new Date().toLocaleDateString('en-GB'),
    ...item,
  })
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads))
  return uploads
}

export function removeUpload(id) {
  const uploads = getUploads().filter((item) => item.id !== id)
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads))
  return uploads
}

// Replaces the fields of one saved upload and keeps the same id.
export function updateUpload(id, changes) {
  const uploads = getUploads().map((item) => (item.id === id ? { ...item, ...changes } : item))
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads))
  return uploads
}
