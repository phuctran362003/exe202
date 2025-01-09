import { Route, Routes } from 'react-router-dom'
import RouteLayout from './components/global/RootLayout'
import ManagerProtectedRoute from './auth/ManagerProtectedRoute'
import { Suspense, useEffect, useState } from 'react'
// import Order from './pages/Order'
import Loader from './components/Loading/Loader'
import ProtectedRoute from './auth/ProtectedRoute'
import SignInForm from './components/global/SignInForm'
import ProductDetails from './pages/ProductDetail'
import Loading from './components/Loading/Loading'
import TableOrder from './pages/TableOrder'
import DashboardManager from './pages/DashboardManager'
import TableProducts from './pages/TableProducts'
import ProductUpdate from './pages/ProductUpdate'
import AddProduct from './pages/AddProduct'
import ProfilePage from './pages/ProfilePage'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import DashboardAdmin from './pages/DashboardAdmin'
import TableUser from './pages/TableUser'
import OrderOfUser from './pages/OrderOfUser'
import TableShops from './pages/TableShops'
import ShopDetails from './pages/ShopDetails'
import AddShop from './pages/AddShop'
import Transaction from './pages/Transaction'
function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return loading ? (
    <div><Loading/></div>
  ) : (
    <Routes>
      <Route element={<RouteLayout />}>
        <Route
          path='/home/manager'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <DashboardManager />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/home/admin'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <DashboardAdmin />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/users'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TableUser />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/orderUser/:id'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <OrderOfUser />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/shops'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TableShops />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/shops/:id'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <ShopDetails />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TableOrder />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/orders/:id'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TableOrder />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/products'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <TableProducts />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/products/:id'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <ProductUpdate />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <ProfilePage />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/products/add'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <AddProduct />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
        <Route
          path='/shops/add'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <AddShop />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/transactions/:id'
          element={
            <AdminProtectedRoute>
              <Suspense fallback={<Loader />}>
                <Transaction />
              </Suspense>
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/transactions'
          element={
            <ManagerProtectedRoute>
              <Suspense fallback={<Loader />}>
                <Transaction />
              </Suspense>
            </ManagerProtectedRoute>
          }
        />
      </Route>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <SignInForm />
          </ProtectedRoute>
        }
      />
      <Route
        path='/productDetails/:id'
        element={
          <ManagerProtectedRoute>
            <ProductDetails />
          </ManagerProtectedRoute>
        }
      />
      <Route
        path='/productDetail/:id'
        element={
          <AdminProtectedRoute>
            <ProductDetails />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
