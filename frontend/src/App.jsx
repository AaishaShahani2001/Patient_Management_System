// App shell: shared navbar and footer, plus every page route.
import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from './pages/Home.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/SignUp.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import MedicalRecords from './pages/MedicalRecords.jsx';
import Doctors from './pages/Doctors.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import { ensureUsers } from './auth';

export default function App() {
  // Make sure the demo patient and admin exist in localStorage on first load.
  useEffect(() => {
    ensureUsers()
  }, [])

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        {/* Toast messages, including the booking confirmation. */}
        <Toaster position="top-center" />
        <Navbar />
        {/* Public pages, doctor booking, and the two dashboards. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

