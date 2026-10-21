import { Link } from 'react-router-dom'
import logo from '../assets/medicare_logo.png'

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-[#f5f9fa] px-5 sm:px-10">
      <Link to="/" aria-label="MediCare home">
        <img src={logo} alt="MediCare" className="h-11 w-auto bg-[#f5f9fa] sm:h-[52px]" />
      </Link>

      <Link
        to="/signup"
        className="rounded-lg border border-[#2F6FED] px-4 py-1.5 text-sm font-medium text-[#2F6FED] transition hover:bg-[#2F6FED]/5 sm:px-5"
      >
        Sign Up
      </Link>
    </header>
  )
}
