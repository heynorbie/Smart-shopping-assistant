import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Zap, Tag, Users, Calendar, MapPin } from 'lucide-react';

interface SuggestionPanelProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const SuggestionPanel = ({ onSuggestionClick }: SuggestionPanelProps) => {
  const allSuggestions = [
    "Show me trending Amazon products",
    "Find grocery items from BigBasket", 
    "Show electronics under ₹5000",
    "Find gifts under ₹4150",
    "Show me fashion deals",
    "Find budget-friendly accessories",
    "Show popular beauty products",
    "Find kitchen essentials",
    "Show me footwear collection",
    "Find computer accessories",
    "Show trending electronics",
    "Find home & garden items"
  ];
  
  // Randomize suggestions each render
  const quickSuggestions = allSuggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const allCategories = [
    { name: "Electronics", count: "1.4k items", icon: Zap },
    { name: "Fashion", count: "3.8k items", icon: TrendingUp },
    { name: "Grocery", count: "38k items", icon: Tag },
    { name: "Beauty & Hygiene", count: "2.1k items", icon: Users },
    { name: "Footwear", count: "850 items", icon: TrendingUp },
    { name: "Accessories", count: "1.2k items", icon: Zap },
    { name: "Home & Kitchen", count: "2.5k items", icon: Tag },
    { name: "Computer", count: "650 items", icon: Zap }
  ];
  
  // Randomize categories each render  
  const trendingCategories = allCategories
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const contextualSuggestions = [
    {
      icon: Calendar,
      title: "Amazon Deals",
      description: "Top-rated products with verified reviews",
      action: "Browse Amazon products"
    },
    {
      icon: MapPin,
      title: "BigBasket Fresh",
      description: "Grocery and household essentials",
      action: "Show BigBasket items"
    },
    {
      icon: Tag,
      title: "Budget Finds",
      description: "Great products under ₹2000",
      action: "Find budget products"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="p-4 bg-gradient-card border-product-card-border shadow-soft">
        <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={`${suggestion}-${index}`}
              variant="ghost"
              className="justify-start text-left h-auto p-3 hover:bg-muted/50 transition-colors"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <span className="text-sm">{suggestion}</span>
            </Button>
          ))}
          <Button
            variant="outline"
            className="justify-center mt-2 text-primary border-primary/20 hover:bg-primary/5"
            onClick={() => window.location.reload()}
          >
            🎲 Show me something new
          </Button>
        </div>
      </Card>

      {/* Trending Categories */}
      <Card className="p-4 bg-gradient-card border-product-card-border shadow-soft">
        <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Trending Categories
        </h3>
        <div className="space-y-3">
          {trendingCategories.map((category, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between p-3 hover:bg-muted/50 transition-colors"
              onClick={() => onSuggestionClick(`Show ${category.name.toLowerCase()} products`)}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Contextual Suggestions */}
      <Card className="p-4 bg-gradient-card border-product-card-border shadow-soft">
        <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5 text-warning" />
          For You
        </h3>
        <div className="space-y-4">
          {contextualSuggestions.map((item, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-card-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-auto p-0 mt-2 text-primary hover:text-primary/80"
                    onClick={() => onSuggestionClick(item.action)}
                  >
                    {item.action}
                  </Button>
                </div>
              </div>
              {index < contextualSuggestions.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};