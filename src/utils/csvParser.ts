import { 
  ShoppingTrend, 
  AmazonProduct, 
  BigBasketProduct, 
  SupermartSale, 
  ProductCategory,
  FlipkartProduct,
  EnhancedProduct 
} from '@/types/shopping';

export const parseShoppingTrendsCSV = async (csvText: string): Promise<ShoppingTrend[]> => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      customerId: parseInt(values[0]) || 0,
      age: parseInt(values[1]) || 0,
      gender: values[2] || '',
      itemPurchased: values[3] || '',
      category: values[4] || '',
      purchaseAmount: parseFloat(values[5]) || 0,
      location: values[6] || '',
      size: values[7] || '',
      color: values[8] || '',
      season: values[9] || '',
      reviewRating: parseFloat(values[10]) || 0,
      subscriptionStatus: values[11] || '',
      shippingType: values[12] || '',
      discountApplied: values[13] || '',
      promoCodeUsed: values[14] || '',
      previousPurchases: parseInt(values[15]) || 0,
      paymentMethod: values[16] || '',
      frequencyOfPurchases: values[17] || '',
    };
  });
};

export const parseAmazonProductsCSV = async (csvText: string): Promise<AmazonProduct[]> => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      productId: values[0] || '',
      productName: values[1] || '',
      category: values[2] || '',
      discountedPrice: values[3] || '',
      actualPrice: values[4] || '',
      discountPercentage: values[5] || '',
      rating: parseFloat(values[6]) || 0,
      ratingCount: values[7] || '',
      aboutProduct: values[8] || '',
      userIds: values[9] ? values[9].split(',') : [],
      userNames: values[10] ? values[10].split(',') : [],
      reviewIds: values[11] ? values[11].split(',') : [],
      reviewTitles: values[12] ? values[12].split(',') : [],
      reviewContents: values[13] ? values[13].split(',') : [],
      imgLink: values[14] || '',
      productLink: values[15] || '',
    };
  });
};

export const parseBigBasketProductsCSV = async (csvText: string): Promise<BigBasketProduct[]> => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      index: parseInt(values[0]) || 0,
      product: values[1] || '',
      category: values[2] || '',
      subCategory: values[3] || '',
      brand: values[4] || '',
      salePrice: parseFloat(values[5]) || 0,
      marketPrice: parseFloat(values[6]) || 0,
      type: values[7] || '',
      rating: parseFloat(values[8]) || 0,
      description: values[9] || '',
    };
  });
};

export const parseSupermartSalesCSV = async (csvText: string): Promise<SupermartSale[]> => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      orderId: values[0] || '',
      customerName: values[1] || '',
      category: values[2] || '',
      subCategory: values[3] || '',
      city: values[4] || '',
      orderDate: values[5] || '',
      region: values[6] || '',
      sales: parseFloat(values[7]) || 0,
      discount: parseFloat(values[8]) || 0,
      profit: parseFloat(values[9]) || 0,
      state: values[10] || '',
    };
  });
};

export const parseCategoriesCSV = async (csvText: string): Promise<ProductCategory[]> => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      id: parseInt(values[0]) || 0,
      categoryName: values[1] || '',
    };
  });
};

export const parseFlipkartProductsCSV = async (csvText: string): Promise<FlipkartProduct[]> => {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    
    return {
      category1: values[0] || '',
      category2: values[1] || '',
      category3: values[2] || '',
      title: values[3] || '',
      productRating: parseFloat(values[4]) || 0,
      sellingPrice: values[5] || '',
      mrp: values[6] || '',
      sellerName: values[7] || '',
      sellerRating: parseFloat(values[8]) || 0,
      description: values[9] || '',
      highlights: values[10] || '',
      imageLinks: values[11] || '',
    };
  });
};

// Convert different product sources to unified format
export const convertToEnhancedProducts = (
  amazonProducts: AmazonProduct[],
  bigBasketProducts: BigBasketProduct[],
  shoppingTrends: ShoppingTrend[],
  flipkartProducts: FlipkartProduct[] = []
): EnhancedProduct[] => {
  const products: EnhancedProduct[] = [];

  // Convert Amazon products
  amazonProducts.forEach(product => {
    const discountedPrice = parseFloat(product.discountedPrice.replace(/[₹,]/g, ''));
    const actualPrice = parseFloat(product.actualPrice.replace(/[₹,]/g, ''));
    
    products.push({
      id: product.productId,
      name: product.productName,
      category: product.category.split('|')[0] || product.category,
      price: discountedPrice || actualPrice,
      originalPrice: actualPrice > discountedPrice ? actualPrice : undefined,
      discount: actualPrice > discountedPrice ? Math.round(((actualPrice - discountedPrice) / actualPrice) * 100) : undefined,
      rating: product.rating,
      ratingCount: product.ratingCount,
      description: product.aboutProduct,
      image: product.imgLink,
      source: 'amazon'
    });
  });

  // Convert BigBasket products with unique keys
  bigBasketProducts.forEach(product => {
    products.push({
      id: `bb_${product.index}_${product.product.replace(/\s+/g, '_').substring(0, 20)}`,
      name: product.product,
      category: product.category,
      price: product.salePrice,
      originalPrice: product.marketPrice > product.salePrice ? product.marketPrice : undefined,
      discount: product.marketPrice > product.salePrice ? Math.round(((product.marketPrice - product.salePrice) / product.marketPrice) * 100) : undefined,
      rating: product.rating,
      description: product.description,
      brand: product.brand,
      source: 'bigbasket'
    });
  });

  // Convert shopping trends to products with unique keys
  const uniqueTrends = new Map<string, ShoppingTrend>();
  shoppingTrends.forEach(trend => {
    const key = `${trend.itemPurchased}-${trend.category}-${trend.color}-${trend.size}`;
    if (!uniqueTrends.has(key) || trend.reviewRating > (uniqueTrends.get(key)?.reviewRating || 0)) {
      uniqueTrends.set(key, trend);
    }
  });

  Array.from(uniqueTrends.values()).forEach((trend, index) => {
    products.push({
      id: `trend_${index}_${trend.itemPurchased.replace(/\s+/g, '_')}`,
      name: `${trend.color} ${trend.itemPurchased}`,
      category: trend.category,
      price: Math.round(trend.purchaseAmount * 83), // Convert USD to INR
      rating: trend.reviewRating,
      description: `${trend.category} item in ${trend.color} color, size ${trend.size}`,
      source: 'trends'
    });
  });

  // Convert Flipkart products
  flipkartProducts.forEach((product, index) => {
    const sellingPrice = parseFloat(product.sellingPrice.replace(/[₹,]/g, ''));
    const mrp = parseFloat(product.mrp.replace(/[₹,]/g, ''));
    
    products.push({
      id: `flipkart_${index}_${product.title.replace(/\s+/g, '_').substring(0, 20)}`,
      name: product.title,
      category: product.category2 || product.category1,
      price: sellingPrice,
      originalPrice: mrp > sellingPrice ? mrp : undefined,
      discount: mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : undefined,
      rating: product.productRating,
      description: product.description || product.highlights,
      image: product.imageLinks,
      brand: product.sellerName,
      source: 'flipkart'
    });
  });

  return products;
};

// Helper function to properly parse CSV lines (handles commas in quoted fields)
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

export const loadShoppingTrendsData = async (): Promise<ShoppingTrend[]> => {
  try {
    const response = await fetch('/shopping_behavior_updated.csv');
    const csvText = await response.text();
    return await parseShoppingTrendsCSV(csvText);
  } catch (error) {
    console.error('Error loading shopping trends data:', error);
    return [];
  }
};

export const loadAmazonProductsData = async (): Promise<AmazonProduct[]> => {
  try {
    const response = await fetch('/amazon.csv');
    const csvText = await response.text();
    return await parseAmazonProductsCSV(csvText);
  } catch (error) {
    console.error('Error loading Amazon products data:', error);
    return [];
  }
};

export const loadBigBasketProductsData = async (): Promise<BigBasketProduct[]> => {
  try {
    const response = await fetch('/BigBasket_Products.csv');
    const csvText = await response.text();
    return await parseBigBasketProductsCSV(csvText);
  } catch (error) {
    console.error('Error loading BigBasket products data:', error);
    return [];
  }
};

export const loadFlipkartProductsData = async (): Promise<FlipkartProduct[]> => {
  try {
    const response = await fetch('/flipkart.csv');
    const csvText = await response.text();
    return await parseFlipkartProductsCSV(csvText);
  } catch (error) {
    console.error('Error loading Flipkart products data:', error);
    return [];
  }
};

export const loadAllProductsData = async (): Promise<EnhancedProduct[]> => {
  try {
    // Load both Amazon and Flipkart products
    const [amazonProducts, flipkartProducts] = await Promise.all([
      loadAmazonProductsData(),
      loadFlipkartProductsData()
    ]);
    
    return convertToEnhancedProducts(amazonProducts, [], [], flipkartProducts);
  } catch (error) {
    console.error('Error loading all products data:', error);
    return [];
  }
};