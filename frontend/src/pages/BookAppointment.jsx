// Booking page for one doctor. The doctor id comes from the URL.
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { doctors } from './Doctors'

// Evening times shown under the date buttons.
const times = ['05:00 pm', '06:00 pm', '06:30 pm', '07:00 pm', '07:30 pm', '08:00 pm', '08:30 pm']

// Builds the next seven dates, starting with today.
function upcomingDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return {
      key: date.toDateString(),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      day: date.getDate(),
    }
  })
}

// Blue check shown next to the doctor's name.
function VerifiedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-[#5C6BFF]">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M8 12.2 10.6 15 16 9.2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BookAppointment() {
  // Doctor id is the last part of /book-appointment/:doctorId.
  const { doctorId } = useParams()
  const doctor = doctors.find((item) => item.id === doctorId)
  const days = useMemo(() => upcomingDays(), [])
  // Both stay empty until the user picks them. The book button waits for both.
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  // Unknown ids show a short message and a link back to the list.
  if (!doctor) {
    return (
      <main className="flex flex-1 items-center justify-center bg-white px-4 py-16">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">Doctor not found</h1>
          <Link to="/doctors" className="mt-3 inline-block text-sm font-medium text-[#5C6BFF]">
            Back to doctors
          </Link>
        </div>
      </main>
    )
  }

  // Look up the chosen date so the toast can name the weekday and day number.
  const day = days.find((item) => item.key === selectedDay)
  const canBook = Boolean(selectedDay && selectedTime)

  // Booking runs only after both a date and a time are chosen.
  function handleBook() {
    if (!canBook || !day) return
    toast.success(`Appointment booked with ${doctor.name} on ${day.label} ${day.day} at ${selectedTime}.`)
  }

  return (
    <main className="flex-1 bg-white px-4 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Photo stays on the left. Profile and slots stay in the column beside it. */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Doctor photo on the blue panel. */}
          <div className="flex h-72 w-full shrink-0 items-end justify-center overflow-hidden rounded-xl bg-[#5C6BFF] sm:w-72">
            <img src={doctor.image} alt={doctor.name} className="h-[92%] w-auto object-contain" />
          </div>

          <div className="min-w-0 flex-1">
          {/* Name, specialty, about text, and fee. */}
          <div className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900">{doctor.name}</h1>
              <VerifiedIcon />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>{doctor.credentials} - {doctor.specialty}</span>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{doctor.years}</span>
            </div>

            <h2 className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              About
              <span className="inline-flex size-4 items-center justify-center rounded-full border border-slate-400 text-[10px] text-slate-500">
                i
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{doctor.about}</p>
            <p className="mt-4 text-sm font-medium text-slate-800">Appointment fee: {doctor.fee}</p>
          </div>

        {/* Slots sit under the profile card, not under the photo. */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-slate-800">Booking slots</h2>

          {/* One button per day. The selected day is filled blue. */}
          <div className="mt-4 flex flex-wrap gap-3">
            {days.map((item) => {
              const active = item.key === selectedDay
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedDay(item.key)}
                  className={`flex size-14 flex-col items-center justify-center rounded-full border text-center transition ${
                    active
                      ? 'border-[#5C6BFF] bg-[#5C6BFF] text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-[#5C6BFF]'
                  }`}
                >
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                  <span className="mt-0.5 text-sm font-semibold leading-none">{item.day}</span>
                </button>
              )
            })}
          </div>

          {/* Time choices. The selected time gets a blue outline. */}
          <div className="mt-4 flex flex-wrap gap-2">
            {times.map((time) => {
              const active = time === selectedTime
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`h-9 rounded-full border px-4 text-sm transition ${
                    active
                      ? 'border-[#5C6BFF] text-[#5C6BFF]'
                      : 'border-slate-300 text-slate-600 hover:border-[#5C6BFF]'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>

          {/* Stays faded until a date and a time are both selected, then shows a toast. */}
          <button
            type="button"
            onClick={handleBook}
            disabled={!canBook}
            className={`mt-5 h-11 rounded-full px-8 text-sm font-medium text-white transition ${
              canBook ? 'bg-[#5C6BFF] hover:bg-[#4c5bf0]' : 'cursor-not-allowed bg-[#5C6BFF]/40'
            }`}
          >
            Book an appointment
          </button>
        </section>
          </div>
        </section>
      </div>
    </main>
  )
}
