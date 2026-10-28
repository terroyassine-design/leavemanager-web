import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { RequireAuth } from '@/auth/RequireAuth'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'

// Pages other than login are loaded on demand: the first screen downloads less JavaScript
const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/register',
    lazy: async () => ({ Component: (await import('@/pages/RegisterPage')).RegisterPage }),
  },
  {
    // Everything below requires a logged-in user
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/MyLeavesPage')).MyLeavesPage }),
          },
          {
            path: 'profile',
            lazy: async () => ({ Component: (await import('@/pages/ProfilePage')).ProfilePage }),
          },
          {
            element: <RequireAuth role="MANAGER" />,
            children: [
              {
                path: 'manager',
                lazy: async () => ({ Component: (await import('@/pages/ManagerPage')).ManagerPage }),
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
