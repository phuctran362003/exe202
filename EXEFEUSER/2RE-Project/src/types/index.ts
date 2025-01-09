export enum Gender {
  Male,
  Female,
  Other
}

export type User = {
  userId: string
  userName: string
  passWord: string
  email: string
  address: string
  phoneNumber: string
  roleId: string
  roleName: string
  isShopOwner: boolean
  shopName: string
  shopAddress: string
  shopDescription: string
  shopLogo: string
  createdAt: string
  updatedAt: string
}

export type Product = {
  imgUrl: string
  size: string
  condition: string
  sale: number
  price: number
  brand: string
  name: string
  productId: string
  shopOwner: string
  category: string
  genderCategory: string
  status: string
}
export interface ProductDetail {
  productId: string
  shopOwner: string
  sale: number
  category: string
  genderCategory: string
  size: string
  name: string
  price: number
  mainImgUrl: string
  listImgUrl: string[]
  description: string
  brand: string
  condition: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  orderId: string
  totalPrice: number
  dateTime: string
  address: string
  email: string
  fullName: string
  phone: string
  listProducts: CartItem[]
  status: string
}

export interface CartItem {
  productId: string
  name: string
  size: string
  imageUrl: string
  price: number
}