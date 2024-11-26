import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Auth from './pages/auth'
import Link from './pages/Link'
import RedirectLink from './pages/RedirectLink'


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
        element: <Dashboard/>
      },{
        path:'/auth',
        element: <Auth/>
      },{
        path: '/link/:id',
        element: <Link/>
      },{
        path: '/:id',
        element: <RedirectLink/>
      }
    ]
  }
])

function App() {



  return (
   <RouterProvider router={router} />

  )
}

export default App
