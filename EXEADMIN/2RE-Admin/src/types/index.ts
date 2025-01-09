export enum Gender {
  Male,
  Female,
  Other
}

export type User = {
  name: string
  address?: string
  gender: Gender
}

export interface Order {
  id: string
  totalQuantity: number
  totalPrice: number
  nameUser: string
  date: string
  paymentMethod: string
  status: string
}

export interface OrderUser {
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

export interface CartItem {
  productId: string
  productName: string
  price: number
  imageUrl: string
}


export interface ProductDetail {
  productId: string
  shopId: string
  shopOwner: string
  category: string
  categoryId: string
  genderCategory: string
  genderCategoryId: string
  size: string
  sizeId: string
  name: string
  price: number
  sale: number
  mainImgUrl: string
  listImgUrl: string[]
  description: string
  brand: string
  condition: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ShopDetail {
  shopName: string
  shopLogo: string
  email: string
  shopDescription: string
  shopAddress: string
  shopPhone: string
  userName: string
  phoneNumber: string
  address: string
  shopBank: string
  shopBankId: string
  totalRating: number
  quantityRating: number
  reviews: string[]
}

export interface DataUser {
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
export interface Order {
  id: string
  totalQuantity: number
  totalPrice: number
  nameUser: string 
  status: string
}

export type MothRevenue = {
  month: number
  revenue: number
}

export interface Dashboard {
  totalProducts: number
  totalOrders: number
  revenueThisMonth: number
  monthlyRevenue: MothRevenue[]
  totalRatings: number
}

export interface Product {
  productId: string
  shopOwner: string
  name: string
  price: number
  imgUrl: string
  brand: string
  condition: string
  status: string
  category: string
  genderCategory: string
  size: string
  sale: number
}

export interface IDashboardAdmin {
  totalUsers: number
  totalShops: number
  totalOrdersThisMonth: number
  monthlyRevenue: MothRevenueAdmin[]
  top5Shop: string[]
}

export type MothRevenueAdmin = {
  month: number
  revenue: number
}