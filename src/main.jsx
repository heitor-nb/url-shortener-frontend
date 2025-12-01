import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Dashboard from './components/Dashboard'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in/:demo?", element: <SignIn /> },
      { path: "/sign-up", element: <SignUp />},
      { path: "/dashboard", element: <Dashboard />}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
