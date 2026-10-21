import { useState } from 'react'
import { Link } from 'react-router-dom'
import background from '../assets/pms.jpeg'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const genders = [
  { value: 'M', label: 'M' },
  { value: 'FM', label: 'FM' },
  { value: 'not-to-prefer', label: 'Not to prefer' },
]

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

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c1.2-2.8 3.5-4.2 6.5-4.2s5.3 1.4 6.5 4.2" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M8 4.5h2.2l1.1 2.6-1.4 1a12 12 0 0 0 5 5l1-1.4 2.6 1.1V15a1.5 1.5 0 0 1-1.6 1.5A13.5 13.5 0 0 1 6.5 6.1 1.5 1.5 0 0 1 8 4.5Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [bloodGroup, setBloodGroup] = useState('')
  const [gender, setGender] = useState('')
  const [photoName, setPhotoName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
  }

  function handlePhoto(event) {
    setPhotoName(event.target.files?.[0]?.name ?? '')
  }

  return (
    <main className="relative flex flex-1 justify-center px-4 py-8">
      <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-slate-900/15" />

      <form
        onSubmit={handleSubmit}
        className="relative my-auto w-full max-w-[760px] rounded-2xl bg-white px-7 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:px-8"
      >
        <h1 className="text-[26px] font-bold leading-tight text-slate-900">Create Your Account</h1>
        <p className="mt-1.5 text-[13.5px] text-slate-500">Join the Medicare Hospital and Patient Portal.</p>

        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="block text-[13px] font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <UserIcon />
              </span>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={`${fieldClass} pr-3 pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-[13px] font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <MailIcon />
              </span>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${fieldClass} pr-3 pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact" className="block text-[13px] font-medium text-slate-700">
              Contact number
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <PhoneIcon />
              </span>
              <input
                id="contact"
                type="tel"
                autoComplete="tel"
                required
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className={`${fieldClass} pr-3 pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-[13px] font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                <LockIcon />
              </span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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
          </div>

          <div>
            <label htmlFor="bloodGroup" className="block text-[13px] font-medium text-slate-700">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              required
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
              className={`${fieldClass} mt-1.5 px-3`}
            >
              <option value="" disabled>
                Select blood group
              </option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="text-[13px] font-medium text-slate-700">Gender</legend>
            <div className="mt-1.5 flex h-11 flex-wrap items-center gap-2">
              {genders.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                    gender === option.value
                      ? 'border-[#2F6FED] bg-[#2F6FED]/10 text-[#2F6FED]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    required
                    checked={gender === option.value}
                    onChange={(event) => setGender(event.target.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <label htmlFor="photo" className="block text-[13px] font-medium text-slate-700">
              Profile photo <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="mt-1.5 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#2F6FED]/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2F6FED]"
            />
            {photoName ? <p className="mt-1.5 text-xs text-slate-500">{photoName}</p> : null}
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 h-11 w-full rounded-lg bg-[#2F6FED] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(47,111,237,0.35)] transition hover:bg-[#245ee0]"
        >
          Sign Up
        </button>

        <div className="my-5 flex items-center gap-3 text-[11px] tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          OR
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Link
          to="/admin-login"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <UserIcon />
          Admin Login
        </Link>

        <p className="mt-5 text-center text-[13.5px] text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#2F6FED]">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}
