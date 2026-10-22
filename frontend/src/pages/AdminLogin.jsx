import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import background from '../assets/pms.jpeg'
import profileIcon from '../assets/profile_icon.png'
import { getSession, login } from '../auth'

const fieldClass =
  'h-11 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7.5 12 13l8-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session?.role === 'admin') navigate('/admin-dashboard', { replace: true })
    if (session?.role === 'patient') navigate('/patient-dashboard', { replace: true })
  }, [navigate])

  function handleSubmit(event) {
    event.preventDefault()
    const user = login(email, password, 'admin')
    if (!user) {
      setError('Invalid email or password.')
      return
    }
    setError('')
    navigate('/admin-dashboard')
  }

  return (
    <main className="relative flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-8">
      <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-slate-900/10" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[420px] rounded-2xl bg-white px-7 py-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:px-8"
      >
        <img src={profileIcon} alt="" className="mx-auto size-16 object-contain" />
        <h1 className="mt-4 text-[26px] font-bold leading-tight text-slate-900">Admin Login</h1>
        <p className="mt-1.5 text-[13.5px] text-slate-500">Sign in with your administrator account.</p>

        <label htmlFor="admin-email" className="mt-6 block text-left text-[13px] font-medium text-slate-700">
          Email Address
        </label>
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            <MailIcon />
          </span>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${fieldClass} pr-3 pl-10`}
          />
        </div>

        <label htmlFor="admin-password" className="mt-4 block text-left text-[13px] font-medium text-slate-700">
          Password
        </label>
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            <LockIcon />
          </span>
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${fieldClass} pr-16 pl-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-[#2F6FED]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && <p className="mt-3 text-left text-[13px] text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-5 h-11 w-full rounded-lg bg-[#2F6FED] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(47,111,237,0.35)] transition hover:bg-[#245ee0]"
        >
          Login
        </button>

        <p className="mt-3 text-[12px] text-slate-400">Demo: admin@medicare.com / admin123</p>

        <div className="my-5 flex items-center gap-3 text-[11px] tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Link
          to="/login"
          className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Patient Login
        </Link>
      </form>
    </main>
  )
}
