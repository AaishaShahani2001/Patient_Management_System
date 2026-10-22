import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import background from '../assets/pms.jpeg'
import { getSession, login } from '../auth'

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

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const session = getSession()
        if (session?.role === 'patient') navigate('/patient-dashboard', { replace: true })
        if (session?.role === 'admin') navigate('/admin-dashboard', { replace: true })
    }, [navigate])

    function handleSubmit(event) {
        event.preventDefault()
        const user = login(email, password, 'patient')
        if (!user) {
            setError('Invalid email or password.')
            return
        }
        setError('')
        navigate('/patient-dashboard')
    }

    return (
            <main className="relative flex min-h-[calc(100vh-8rem)] flex-1 items-center justify-center px-4 py-8">
                <img
                    src={background}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-900/10" />

                <form
                    onSubmit={handleSubmit}
                    className="relative w-full max-w-[420px] rounded-2xl bg-white px-7 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:px-8"
                >
                    <p className="text-center text-[11px] font-semibold tracking-[0.18em] text-[#2F6FED]">
                        WELCOME BACK
                    </p>
                    <h1 className="mt-2 text-center text-[26px] font-bold leading-tight text-slate-900">
                        Login to Your Account
                    </h1>
                    <p className="mt-2 text-center text-[13.5px] leading-relaxed text-slate-500">
                        Please enter your credentials to access the MediCare portal.
                    </p>

                    <label htmlFor="email" className="mt-5 block text-[13px] font-medium text-slate-700">
                        Email Address
                    </label>
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                            <MailIcon />
                        </span>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                        />
                    </div>

                    <label htmlFor="password" className="mt-4 block text-[13px] font-medium text-slate-700">
                        Password
                    </label>
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                            <LockIcon />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-16 pl-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((visible) => !visible)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-[#2F6FED]"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[13px]">
                        <label htmlFor="remember" className="flex items-center gap-2 text-slate-600">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(event) => setRemember(event.target.checked)}
                                className="size-3.5 accent-[#2F6FED]"
                            />
                            Remember me
                        </label>
                        <a href="#forgot-password" className="font-medium text-[#2F6FED]">
                            Forgot Password?
                        </a>
                    </div>

                    {error && (
                        <p className="mt-3 text-[13px] text-red-600">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="mt-5 h-11 w-full rounded-lg bg-[#2F6FED] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(47,111,237,0.35)] transition hover:bg-[#245ee0]"
                    >
                        Login
                    </button>

                    <p className="mt-3 text-center text-[12px] text-slate-400">
                        Demo: patient@medicare.com / patient123
                    </p>

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
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="font-semibold text-[#2F6FED]">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </main>
    )
}
