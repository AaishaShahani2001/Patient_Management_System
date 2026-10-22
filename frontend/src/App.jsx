import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from './pages/login.jsx';
import SignUp from './pages/SignUp.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Doctors from './pages/Doctors.jsx';
import { ensureUsers } from './auth';

export default function App() {
  useEffect(() => {
    ensureUsers()
  }, [])

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

