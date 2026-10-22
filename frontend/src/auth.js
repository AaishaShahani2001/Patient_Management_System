// Demo login stored in the browser. Passwords stay in localStorage for this student project only.

// All saved accounts.
const USERS_KEY = 'medicareUsers'
// The person who is signed in right now. The password is not stored here.
const SESSION_KEY = 'medicareUser'

// One patient and one admin, added the first time the app loads.
const defaultUsers = [
  {
    name: 'Riya Sharma',
    email: 'patient@medicare.com',
    password: 'patient123',
    role: 'patient',
  },
  {
    name: 'MediCare Admin',
    email: 'admin@medicare.com',
    password: 'admin123',
    role: 'admin',
  },
]

// Adds the demo patient and admin when those emails are not already saved.
export function ensureUsers() {
  const stored = readJson(USERS_KEY, [])
  const emails = new Set(stored.map((user) => user.email.toLowerCase()))
  const users = [...stored]

  defaultUsers.forEach((user) => {
    if (!emails.has(user.email.toLowerCase())) {
      users.push(user)
    }
  })

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users
}

// Returns every saved account, including the demo ones.
export function getUsers() {
  return ensureUsers()
}

// Matches email, password, and role. Saves name, email, and role when the login succeeds.
export function login(email, password, role) {
  const match = ensureUsers().find(
    (user) =>
      user.role === role &&
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  )

  if (!match) return null

  // Session keeps the name and role only. The password is left out.
  const session = { name: match.name, email: match.email, role: match.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

// Reads the signed-in user, or null when nobody is logged in.
export function getSession() {
  return readJson(SESSION_KEY, null)
}

// Clears the signed-in user. Saved accounts stay in localStorage.
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

// Parses a localStorage value. A bad or missing value returns the fallback.
function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
