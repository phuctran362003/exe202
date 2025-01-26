import useLocalStorage from "@/hooks/use-local-storage";
import React, { useContext, useEffect, useState } from 'react'

type CartproviderProps = {
    children: React.ReactNode
}

type CartContextType = {
    cart: string[]
    addToCart: (productId: string) => void
    removeFromCart: (productId: string) => void
    setCart: React.Dispatch<React.SetStateAction<string[]>>
    clearCart: () => void
    quantityInCart: number
}

export const CartContext = React.createContext<CartContextType | null>(null)

const CartProvider = ({ children }: CartproviderProps) => {
    const [cart, setCart] = useLocalStorage<string[]>('cart', [])

    const [quantityInCart, setQuantityInCart] = useState(0)

    const addToCart = (productId: string) => {
        if(!cart.includes(productId)) {
            setCart([...cart, productId])
        }
    }

    const removeFromCart = (productId: string) => {
        setCart(cart.filter((id) => id !== productId))
        console.log(cart.filter((id) => id !== productId))
    }

    const clearCart = () => {
        setCart([])
    }

    useEffect(() => {
        setQuantityInCart(cart.length)
    }, [cart])

    return (
        <CartContext.Provider value={{ cart, addToCart, setCart, removeFromCart, clearCart, quantityInCart }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) {
      throw new Error('useCartContext must be used within a CartProvider')
    }
    return context
  }