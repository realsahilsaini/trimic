import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'
import UrlProvider from './context'
import RequireAuth from './Components/require-auth'


const router = createBrowserRouter([
  // App routes here 
  {
    // App layout is the parent layout for all routes 
    element: <AppLayout />,
    children: [
      // Add routes here 
      {
        path:'/',
        element: <LandingPage/>
      },{
        path:'/dashboard',
        element: <RequireAuth><Dashboard/></RequireAuth>
      },{
        path:'/auth',
        element: <Auth/>
      },{
        path: '/link/:id',
        element: <RequireAuth><Link/></RequireAuth>
      },{
        path: '/:id',
        element: <RedirectLink/>
      }
    ]
  }
])

function App() {



  return (
   
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>

  )
}

export default App
