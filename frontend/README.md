# MediCare frontend

React app for the MediCare patient portal. It covers the home page, patient and admin login, the doctor list, appointment booking, the patient dashboard, medical records, and the admin dashboard.

Accounts and the signed-in user are saved in `localStorage`. There is no server API in this folder.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

```bash
npm run build    # production build
npm run preview  # serve the production build
npm run lint     # check the source with ESLint
```

## Demo login

| Role | Email | Password | Opens |
| --- | --- | --- | --- |
| Patient | patient@medicare.com | patient123 | `/patient-dashboard` |
| Admin | admin@medicare.com | admin123 | `/admin-dashboard` |

## Routes

- `/` — hero banner
- `/login` — patient login
- `/signup` — registration form
- `/admin-login` — admin login
- `/doctors` — searchable doctor list
- `/book-appointment/:doctorId` — profile, slots, and a success toast
- `/patient-dashboard` — patient home
- `/medical-records` — record, prescriptions, lab reports, and payments
- `/admin-dashboard` — saved patients

The navbar shows **Sign Up** until someone is logged in. It then shows that person's dashboard link.
