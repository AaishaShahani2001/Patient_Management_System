// Medical record page. Tabs switch between the record, prescriptions, lab reports, and payments.
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getSession } from '../auth'
import RecordOverview from '../components/patient/RecordOverview'
import PrescriptionList from '../components/patient/PrescriptionList'
import LabReportList from '../components/patient/LabReportList'
import PaymentList from '../components/patient/PaymentList'

const tabs = [
  { id: 'record', label: 'Medical record' },
  { id: 'prescriptions', label: 'Prescriptions' },
  { id: 'labs', label: 'Lab reports' },
  { id: 'payments', label: 'Payments' },
]

export default function MedicalRecords() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [user, setUser] = useState(null)

  // Same guard as the patient dashboard: only a signed-in patient can open the record.
  useEffect(() => {
    const session = getSession()
    if (!session || session.role !== 'patient') {
      navigate('/login', { replace: true })
      return
    }
    setUser(session)
  }, [navigate])

  if (!user) return null

  // Unknown ?tab= values fall back to the record overview.
  const requested = searchParams.get('tab')
  const active = tabs.some((tab) => tab.id === requested) ? requested : 'record'

  return (
    <main className="flex-1 bg-[#f5f9fa] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">ELECTRONIC MEDICAL RECORD</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
          <Link to="/patient-dashboard" className="text-sm font-medium text-[#2F6FED]">
            Back to dashboard
          </Link>
        </div>

        {/* The tab id is written to the URL so dashboard links can open one section. */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`h-10 rounded-lg px-4 text-sm font-medium transition ${
                active === tab.id
                  ? 'bg-[#2F6FED] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {active === 'record' && <RecordOverview email={user.email} />}
          {active === 'prescriptions' && <PrescriptionList email={user.email} />}
          {active === 'labs' && <LabReportList email={user.email} />}
          {active === 'payments' && <PaymentList />}
        </div>
      </div>
    </main>
  )
}
