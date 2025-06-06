import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Tailwind CSS
import { AuthProvider } from './contexts/AuthContext.jsx'
import { RouterProvider } from './contexts/RouterContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>,
)

// Make sure your src/index.css contains:
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

// And your tailwind.config.js is set up, e.g.:
/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         inter: ['Inter', 'sans-serif'], // Example if you want to use Inter
//       },
//     },
//   },
//   plugins: [],
// }