const USERS_KEY = 'medicareUsers'
const SESSION_KEY = 'medicareUser'

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

export function getUsers() {
  return ensureUsers()
}

export function login(email, password, role) {
  const match = ensureUsers().find(
    (user) =>
      user.role === role &&
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  )

  if (!match) return null

  const session = { name: match.name, email: match.email, role: match.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getSession() {
  return readJson(SESSION_KEY, null)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
