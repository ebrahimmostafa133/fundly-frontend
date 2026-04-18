import AppRoutes from './routes/AppRoutes'
import AppFooter from './components/shared/app-footer'
import AppHeader from './components/shared/app-header'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <AppFooter />
    </div>
  )
}

export default App
