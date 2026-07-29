import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import LanguageSwitcher from './components/LanguageSwitcher'

export default function App() {
  const location = useLocation()
  const isCV = location.pathname === '/cv'

  return (
    <div className="min-h-screen">
      {!isCV && <Nav />}
      {!isCV && <LanguageSwitcher />}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
