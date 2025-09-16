import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, ExternalLink, Package } from 'lucide-react';
import { useState } from 'react';
import { EnhancedProduct } from '@/types/shopping';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import placeholderClothing from '@/assets/placeholder-clothing.jpg';
import placeholderGrocery from '@/assets/placeholder-grocery.jpg';

interface ProductCardProps {
  product: EnhancedProduct;
}

// Get category-specific placeholder image
const getCategoryPlaceholder = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('clothing') || categoryLower.includes('fashion')) {
    return placeholderClothing;
  } else if (categoryLower.includes('kitchen') || categoryLower.includes('beauty') || categoryLower.includes('cleaning')) {
    return placeholderGrocery;
  }
  
  // Default to clothing placeholder
  return placeholderClothing;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  // Generate review count if not available
  const reviewCount = product.ratingCount ? 
    parseInt(product.ratingCount.replace(/[^\d]/g, '')) || Math.floor(Math.random() * 1000) + 100 :
    Math.floor(Math.random() * 1000) + 100;

  // Source-specific styling
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'amazon': return 'bg-orange-500 text-white';
      case 'bigbasket': return 'bg-green-600 text-white';
      case 'flipkart': return 'bg-blue-600 text-white';
      case 'trends': return 'bg-purple-500 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-product-card border-product-card-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <img
            src={getCategoryPlaceholder(product.category)}
            alt={`${product.category} placeholder`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Source Badge */}
          <Badge className={`${getSourceColor(product.source)} font-medium text-xs capitalize`}>
            {product.source}
          </Badge>
          
          {/* Discount Badge */}
          {product.discount && (
            <Badge className="bg-product-discount text-white font-medium">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm"
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} 
          />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wide">
            {product.category}
          </span>
          {product.brand && (
            <span className="text-primary font-medium">{product.brand}</span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-card-foreground line-clamp-2 leading-5 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-product-price">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Description Preview */}
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-4">
            {product.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="border-product-card-border hover:bg-muted"
            onClick={() => {
              // Open external link if available (for Amazon products)
              if (product.source === 'amazon') {
                console.log('View product details:', product.id);
              }
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};