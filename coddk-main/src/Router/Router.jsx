import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Home from '../pages/Home';
import PublicForm from '../pages/PublicForm';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Notfound from '../pages/Notfound';
import ProtectedRoute from '../components/ProtectedRoute';
import Admins from '../pages/Admins';
import PendingSubmissions from '../pages/PendingSubmissions';
import Settings from '../pages/Settings';

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "form", element: <PublicForm /> },
      { path: "login", element: <Login /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute superAdminOnly>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "pending",
        element: (
          <ProtectedRoute superAdminOnly>
            <PendingSubmissions />
          </ProtectedRoute>
        ),
      },
      {
        path: "admins",
        element: (
          <ProtectedRoute superAdminOnly>
            <Admins />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute adminOnly>
            <Employees />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

