export interface ShoppingTrend {
  customerId: number;
  age: number;
  gender: string;
  itemPurchased: string;
  category: string;
  purchaseAmount: number;
  location: string;
  size: string;
  color: string;
  season: string;
  reviewRating: number;
  subscriptionStatus: string;
  shippingType: string;
  discountApplied: string;
  promoCodeUsed: string;
  previousPurchases: number;
  paymentMethod: string;
  frequencyOfPurchases: string;
}

export interface AmazonProduct {
  productId: string;
  productName: string;
  category: string;
  discountedPrice: string;
  actualPrice: string;
  discountPercentage: string;
  rating: number;
  ratingCount: string;
  aboutProduct: string;
  imgLink: string;
  productLink: string;
  userIds: string[];
  userNames: string[];
  reviewIds: string[];
  reviewTitles: string[];
  reviewContents: string[];
}

export interface BigBasketProduct {
  index: number;
  product: string;
  category: string;
  subCategory: string;
  brand: string;
  salePrice: number;
  marketPrice: number;
  type: string;
  rating: number;
  description: string;
}

export interface SupermartSale {
  orderId: string;
  customerName: string;
  category: string;
  subCategory: string;
  city: string;
  orderDate: string;
  region: string;
  sales: number;
  discount: number;
  profit: number;
  state: string;
}

export interface ProductCategory {
  id: number;
  categoryName: string;
}

export interface CategoryAnalytics {
  category: string;
  totalSales: number;
  averageRating: number;
  itemCount: number;
}

export interface LocationAnalytics {
  location: string;
  totalSales: number;
  customerCount: number;
  averageOrderValue: number;
}

export interface FlipkartProduct {
  category1: string;
  category2: string;
  category3: string;
  title: string;
  productRating: number;
  sellingPrice: string;
  mrp: string;
  sellerName: string;
  sellerRating: number;
  description: string;
  highlights: string;
  imageLinks: string;
}

export interface EnhancedProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  ratingCount?: string;
  description: string;
  image?: string;
  brand?: string;
  source: 'amazon' | 'bigbasket' | 'trends' | 'flipkart';
}