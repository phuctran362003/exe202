import { Route, Routes } from "react-router-dom"
import RootLayout from "./components/global/rootLayout"
import HomePage from "./pages/HomePage"
import ProductDetails from "./pages/ProductDetail"
import CartPage from "./pages/CartPage"
import Checkout from "./pages/Checkout"
import FavoritePage from "./pages/FavoritePage"
import NotFound from "./pages/NotFound"
import Compare from "./pages/Compare"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ProductsPage from "./pages/ProductsPage"
import SearchPage from "./pages/SearchPage"
import ShopPage from "./pages/ShopPage"
import ShopDetail from "./pages/ShopDetail"
import QRpage from "./pages/QRpage"
import PaymentSuccess from "./pages/PaymentSuccess"
import OrderPage from "./pages/OrderPage"
import ProfilePage from "./pages/ProfilePage"
import PaymentFailure from "./pages/PaymentFailure"
import ProtectUserRoute from "./contexts/ProtectUserRoute"
import ProtectedRoute from "./contexts/ProtectedRoute"

function App() {
  return <>
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/shopDetails/:id" element={<ShopDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/favorite' element={<FavoritePage />} />
        <Route path="/checkout" element={<ProtectUserRoute><Checkout /></ProtectUserRoute>} />
        <Route path="/compare" element={<Compare />} />   
        <Route path="/shop" element={<ShopPage />} />   
        <Route path="/orders" element={<ProtectUserRoute><OrderPage /></ProtectUserRoute>} />   
        <Route path="/profile" element={<ProtectUserRoute><ProfilePage /></ProtectUserRoute>} />   
        <Route path="/payment-success" element={<PaymentSuccess />} />   
        <Route path="/payment-failure" element={<PaymentFailure />} />   
      </Route>
        <Route path="/qrpay" element={<QRpage />} />   
      <Route path="/search" element={<SearchPage />} />
      <Route path="/auth/sign-in" element={<ProtectedRoute><SignIn /></ProtectedRoute>} />
      <Route path="/auth/sign-up" element={<ProtectedRoute><SignUp /></ProtectedRoute>} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </>
}

export default App
