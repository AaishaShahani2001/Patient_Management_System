// Doctor list. Search and specialty filters run in the browser, then Book Appointment opens the booking page.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import doc1 from '../assets/doc1.png'
import doc2 from '../assets/doc2.png'
import doc3 from '../assets/doc3.png'
import doc4 from '../assets/doc4.png'
import doc5 from '../assets/doc5.png'

// Shared with the booking page so a card and its profile use the same doctor.
export const doctors = [
  {
    id: 'sarah',
    name: 'Dr. Sarah Jenkins',
    credentials: 'MD, FACC',
    specialty: 'Cardiology',
    rating: 4.9,
    reviews: 128,
    location: 'Heart Care Clinic, Andheri',
    tags: ['Heart checkup', 'BP care'],
    nextSlot: 'Today, 4:30 PM',
    fee: 'Rs.8000',
    years: '8 Years',
    about: 'Dr. Sarah Jenkins focuses on heart checkups and blood pressure care, with clear advice on prevention and follow-up.',
    image: doc2,
    topRated: true,
  },
  {
    id: 'marcus',
    name: 'Dr. Marcus Vance',
    credentials: 'MD',
    specialty: 'Dermatology',
    rating: 4.8,
    reviews: 96,
    location: 'Skin & Care Centre, Bandra',
    tags: ['Skin consult', 'Allergy'],
    nextSlot: 'Tomorrow, 11:00 AM',
    fee: 'Rs.6000',
    years: '6 Years',
    about: 'Dr. Marcus Vance treats common skin concerns and allergies, and explains each step of care in plain language.',
    image: doc1,
  },
  {
    id: 'elena',
    name: 'Dr. Elena Rostova',
    credentials: 'MD, PhD',
    specialty: 'Neurology',
    rating: 4.9,
    reviews: 154,
    location: 'City Neuro Clinic, Powai',
    tags: ['Headache', 'Nerve care'],
    nextSlot: 'Today, 6:15 PM',
    fee: 'Rs.9000',
    years: '10 Years',
    about: 'Dr. Elena Rostova sees patients for headaches and nerve-related symptoms, and plans treatment around an early diagnosis.',
    image: doc5,
  },
  {
    id: 'david',
    name: 'Dr. David Kim',
    credentials: 'DO',
    specialty: 'Orthopedics',
    rating: 4.7,
    reviews: 81,
    location: 'Bone & Joint Hospital, Dadar',
    tags: ['Joint pain', 'Sports injury'],
    nextSlot: 'Fri, 9:00 AM',
    fee: 'Rs.7500',
    years: '7 Years',
    about: 'Dr. David Kim helps with joint pain and sports injuries, and focuses on practical recovery plans.',
    image: doc3,
  },
  {
    id: 'rachel',
    name: 'Dr. Rachel Patel',
    credentials: 'MD',
    specialty: 'Pediatrics',
    rating: 4.8,
    reviews: 110,
    location: 'Little Care Clinic, Juhu',
    tags: ['Child checkup', 'Vaccination'],
    nextSlot: 'Tomorrow, 2:00 PM',
    fee: 'Rs.5000',
    years: '4 Years',
    about: 'Dr. Rachel Patel provides child checkups and vaccinations, and keeps visits calm for both children and parents.',
    image: doc4,
  },
]

// "All" plus one option for each specialty on the list above.
const specialties = ['All', ...new Set(doctors.map((doctor) => doctor.specialty))]

// Fills gold stars up to the rounded rating and leaves the rest gray.
function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="tracking-tight text-amber-400" aria-hidden="true">
      {'★'.repeat(full)}
      <span className="text-slate-300">{'★'.repeat(5 - full)}</span>
    </span>
  )
}

export default function Doctors() {
  // Search box text and the specialty dropdown.
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All')

  // Match the search text and the specialty dropdown together.
  const visible = doctors.filter((doctor) => {
    const text = `${doctor.name} ${doctor.specialty} ${doctor.location}`.toLowerCase()
    const matchesQuery = text.includes(query.trim().toLowerCase())
    const matchesSpecialty = specialty === 'All' || doctor.specialty === specialty
    return matchesQuery && matchesSpecialty
  })

  return (
    <main className="flex-1 bg-[#f4f7fb] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Find a Doctor & Specialists</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Search by name or specialty and book a visit with a MediCare doctor.
        </p>

        {/* Search by name, specialty, or clinic, then narrow by specialty. */}
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, specialty, or clinic"
            className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/20"
          />
          <select
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#2F6FED]"
          >
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item === 'All' ? 'All specialties' : item}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-5 text-sm font-medium text-slate-600">
          {visible.length} {visible.length === 1 ? 'doctor' : 'doctors'} available
        </p>

        {/* One card per matching doctor. Book Appointment opens that doctor's page. */}
        <ul className="mt-3 space-y-4">
          {visible.map((doctor) => (
            <li key={doctor.id} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-28 w-24 shrink-0 rounded-xl bg-slate-100 object-cover object-top"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {doctor.name}, {doctor.credentials}
                    </h2>
                    {doctor.topRated && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Top rated
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#2F6FED]">{doctor.specialty}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    <Stars rating={doctor.rating} />{' '}
                    <span className="text-slate-700">{doctor.rating}</span>
                    <span className="text-slate-400"> ({doctor.reviews} reviews)</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{doctor.location}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctor.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:w-44 sm:flex-col sm:items-stretch sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                  <div>
                    <p className="text-xs text-slate-400">Next available</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.nextSlot}</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-600">{doctor.fee}</p>
                  </div>
                  <Link
                    to={`/book-appointment/${doctor.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-[#2F6FED] px-4 text-sm font-semibold text-white transition hover:bg-[#245ee0]"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Shown only when the search matches nobody. */}
        {visible.length === 0 && (
          <p className="mt-6 rounded-2xl bg-white px-5 py-8 text-center text-sm text-slate-500 shadow-sm">
            No doctors match that search.
          </p>
        )}

        {/* Emergency note. This is a phone link, not an online booking. */}
        <section className="mt-8 rounded-2xl bg-red-600 px-5 py-4 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-semibold">Need emergency care right now?</h2>
            <p className="mt-1 text-sm text-red-100">
              Do not book online for chest pain, severe injury, or trouble breathing. Call emergency services.
            </p>
          </div>
          <a
            href="tel:1990"
            className="mt-3 inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-red-600 sm:mt-0"
          >
            Call 1990
          </a>
        </section>
      </div>
    </main>
  )
}
