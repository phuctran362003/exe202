import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/poppins'
import '@fontsource/volkhov'
import { Toaster } from 'sonner'
import CartProvider from '@/contexts/CartContext'
import { FavoriteProvider } from './contexts/FavoriteContext.tsx'
import { AuthProvider } from '@/contexts/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Toaster position='top-right' richColors duration={2000}/>
      <FavoriteProvider>
        <CartProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CartProvider>
      </FavoriteProvider>
    </BrowserRouter>
  // </React.StrictMode>
)
