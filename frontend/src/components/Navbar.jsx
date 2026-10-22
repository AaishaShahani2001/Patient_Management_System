import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/medicare_logo.png'
import { getSession } from '../auth'

const tabs = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Doctors' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const session = getSession()
  const dashboard =
    session?.role === 'admin'
      ? { to: '/admin-dashboard', label: 'Admin Dashboard' }
      : session?.role === 'patient'
        ? { to: '/patient-dashboard', label: 'Patient Dashboard' }
        : null

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-[#f5f9fa] px-4 sm:px-10">
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        <Link to="/" aria-label="MediCare home" className="shrink-0">
          <img src={logo} alt="MediCare" className="h-10 w-auto bg-[#f5f9fa] sm:h-[52px]" />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive || (tab.to === '/' && pathname === '/login')
                    ? 'text-[#2F6FED]'
                    : 'text-slate-600 hover:text-[#2F6FED]'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {dashboard ? (
        <Link
          to={dashboard.to}
          className="shrink-0 rounded-lg border border-[#2F6FED] px-2.5 py-1.5 text-[11px] font-medium whitespace-nowrap text-[#2F6FED] transition hover:bg-[#2F6FED]/5 sm:px-5 sm:text-sm"
        >
          {dashboard.label}
        </Link>
      ) : (
        <Link
          to="/signup"
          className="shrink-0 rounded-lg border border-[#2F6FED] px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#2F6FED] transition hover:bg-[#2F6FED]/5 sm:px-5"
        >
          Sign Up
        </Link>
      )}
    </header>
  )
}
