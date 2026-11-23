
# WedPlan — Wedding Planning Platform

WedPlan is a wedding planning platform where customers can explore wedding services, book vendors, and manage their bookings. Vendors can manage their services, while admins can manage the platform.

## Important Features
- Role-based authentication (Customer, Vendor, Admin).
- Explore and view wedding services.
- Vendors can add, update, and delete services.
- Customers can book wedding services.
- Booking and booking request management.
- Admin dashboard for managing users and services.
- Premium vendor subscription with Stripe payment.
- Secure payment verification using Stripe Webhooks.
- Responsive user interface.

## Technology Stack
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI
- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT
- Stripe

## Installation Instructions
1. Clone the client and server repositories.
2. Navigate to each project directory.
3. Install dependencies using:

```bash
npm install
```

4. Configure the required environment variables.

## How to Run the Project Locally

Start the backend:

```bash
nodemon index.js
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Live Website Link
https://wedplan-rosy.vercel.app

## Client and Server Repository Links
- Client: https://github.com/afra705/WedPlan-Client
- Server: https://github.com/afra705/WedPlan-Server
