# Product Manager — Fullstack Assessment

A fullstack shopping cart built with **Express.js** (backend) and **React/Vite** (frontend).

## Prerequisites

- Node.js v18+

## Setup & Running

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd jsd-backend-assessment
```

### 2. Start the Server (Terminal 1)

```bash
cd server
npm install
npm start
```

The server runs at **http://localhost:3000**

### 3. Start the React App (Terminal 2)

```bash
cd client
npm install
npm run dev
```

The React app runs at **http://localhost:5173**

Both must be running at the same time for the app to work.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/products` | Get all products |
| GET | `/products?name=keyboard` | Filter by name |
| GET | `/products?sort=price` | Sort by price |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Add a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

## Testing the API

Open `server/requests.http` with the VS Code REST Client extension to test all routes directly.

## Project Structure

```
jsd-backend-assessment/
├── client/               # React/Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductList.jsx
│   │   ├── api.js        # Centralized fetch helper
│   │   ├── App.jsx       # Main component + state
│   │   └── index.css     # Design system
│   ├── .env              # VITE_API_URL
│   └── package.json
├── server/               # Express API
│   ├── index.js          # Server + all routes
│   ├── requests.http     # REST Client test file
│   └── package.json
├── my-understanding.md
└── README.md
```
