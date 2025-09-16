import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export const CartButton = () => {
  const { getCartItemsCount, setIsOpen } = useCart();
  const itemsCount = getCartItemsCount();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="h-4 w-4" />
      {itemsCount > 0 && (
        <Badge 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
        >
          {itemsCount > 99 ? '99+' : itemsCount}
        </Badge>
      )}
    </Button>
  );
};