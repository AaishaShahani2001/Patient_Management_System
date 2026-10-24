# MediCare Patient Management System

MediCare is a small hospital portal for patients and an administrator. Patients can look through doctors and book a visit. The administrator can see the saved patient accounts. Sign-in is stored in the browser with `localStorage`, so the app runs without a backend.

## Tech

- React 19
- Vite
- Tailwind CSS
- React Router
- react-hot-toast

## Run the app

From the `frontend` folder:

```bash
npm install
npm run dev
```

Vite prints a local address, usually `http://localhost:5173`.

Other scripts:

```bash
npm run build
npm run preview
npm run lint
```

## Demo accounts

These accounts are created in `localStorage` the first time the app loads.

| Role | Email | Password |
| --- | --- | --- |
| Patient | patient@medicare.com | patient123 |
| Admin | admin@medicare.com | admin123 |

## Pages

| Path | What it shows |
| --- | --- |
| `/` | Home hero with the clinic photo and short quotes |
| `/login` | Patient login |
| `/signup` | Patient registration form |
| `/admin-login` | Administrator login |
| `/doctors` | Doctor list with search and a specialty filter |
| `/book-appointment/:doctorId` | Doctor profile, date and time slots, and a booking toast |
| `/patient-dashboard` | Patient home. Opens only after a patient login |
| `/medical-records` | Record, prescriptions, lab reports, and payments. Patient login required |
| `/admin-dashboard` | Patient list read from saved accounts. Admin login required |

After login, the navbar button changes to **Patient Dashboard** or **Admin Dashboard**. Logout clears the current session and returns to the matching login page.
