import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { SuggestionPanel } from '@/components/SuggestionPanel';
import { CartButton } from '@/components/CartButton';
import { CartSidebar } from '@/components/CartSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles, Zap, Users, ArrowRight, BarChart3, Brain } from 'lucide-react';
import heroImage from '@/assets/hero-shopping-bg.jpg';
import { useNavigate } from 'react-router-dom';
import { loadAllProductsData } from '@/utils/csvParser';
import { EnhancedProduct } from '@/types/shopping';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  products?: EnhancedProduct[];
}

const ShoppingChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi there! I'm your personal shopping assistant. I can help you find products from Amazon, BigBasket, and more from our extensive catalog of 50,000+ items. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [allProducts, setAllProducts] = useState<EnhancedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all product data when component mounts
  useEffect(() => {
    loadAllProductsData().then(data => {
      setAllProducts(data);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to load product data:', error);
      setIsLoading(false);
    });
  }, []);

  const getProductsByRequest = (userMessage: string): EnhancedProduct[] => {
    const lowerMessage = userMessage.toLowerCase();
    let filtered = [...allProducts];
    
    // Category-based filtering
    if (lowerMessage.includes('fashion') || lowerMessage.includes('clothing') || lowerMessage.includes('clothes')) {
      filtered = allProducts.filter(product => 
        product.category.toLowerCase().includes('clothing') ||
        product.category.toLowerCase().includes('fashion') ||
        product.name.toLowerCase().includes('shirt') ||
        product.name.toLowerCase().includes('dress') ||
        product.name.toLowerCase().includes('jeans') ||
        product.name.toLowerCase().includes('blouse')
      );
    } else if (lowerMessage.includes('footwear') || lowerMessage.includes('shoes') || lowerMessage.includes('sneakers')) {
      filtered = allProducts.filter(product => 
        product.category.toLowerCase().includes('footwear') ||
        product.name.toLowerCase().includes('shoes') ||
        product.name.toLowerCase().includes('sneakers') ||
        product.name.toLowerCase().includes('sandals')
      );
    } else if (lowerMessage.includes('accessories') || lowerMessage.includes('handbag') || lowerMessage.includes('sunglasses')) {
      filtered = allProducts.filter(product => 
        product.category.toLowerCase().includes('accessories') ||
        product.name.toLowerCase().includes('handbag') ||
        product.name.toLowerCase().includes('sunglasses') ||
        product.name.toLowerCase().includes('bag')
      );
    } else if (lowerMessage.includes('electronics') || lowerMessage.includes('computer') || lowerMessage.includes('mobile')) {
      filtered = allProducts.filter(product => 
        product.category.toLowerCase().includes('computer') ||
        product.category.toLowerCase().includes('electronics') ||
        product.name.toLowerCase().includes('cable') ||
        product.name.toLowerCase().includes('phone')
      );
    } else if (lowerMessage.includes('grocery') || lowerMessage.includes('food') || lowerMessage.includes('kitchen')) {
      filtered = allProducts.filter(product => 
        product.category.toLowerCase().includes('kitchen') ||
        product.category.toLowerCase().includes('beauty') ||
        product.category.toLowerCase().includes('cleaning') ||
        product.source === 'bigbasket'
      );
    } else if (lowerMessage.includes('under') && (lowerMessage.includes('50') || lowerMessage.includes('$50') || lowerMessage.includes('4150') || lowerMessage.includes('₹4150'))) {
      filtered = allProducts.filter(product => product.price <= 4150);
    } else if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
      filtered = allProducts.filter(product => product.rating >= 4.0).sort((a, b) => b.rating - a.rating);
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      filtered = allProducts.filter(product => product.price <= 2000).sort((a, b) => a.price - b.price);
    } else if (lowerMessage.includes('amazon')) {
      filtered = allProducts.filter(product => product.source === 'amazon');
    } else if (lowerMessage.includes('bigbasket') || lowerMessage.includes('grocery')) {
      filtered = allProducts.filter(product => product.source === 'bigbasket');
    }

    // Price range filtering
    if (lowerMessage.includes('under') && lowerMessage.includes('1000')) {
      filtered = filtered.filter(product => product.price <= 1000);
    } else if (lowerMessage.includes('under') && lowerMessage.includes('2000')) {
      filtered = filtered.filter(product => product.price <= 2000);
    } else if (lowerMessage.includes('under') && lowerMessage.includes('5000')) {
      filtered = filtered.filter(product => product.price <= 5000);
    }

    // Randomize and sort by rating, then limit results
    return filtered
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Get relevant products based on the user's request
    const relevantProducts = shouldShowProducts(message) ? getProductsByRequest(message) : undefined;

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(message),
        timestamp: new Date(),
        products: relevantProducts,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fashion') || lowerMessage.includes('clothing') || lowerMessage.includes('clothes')) {
      return "I found some amazing fashion items for you! Here are trendy clothing pieces from Amazon and other retailers in our collection.";
    } else if (lowerMessage.includes('footwear') || lowerMessage.includes('shoes') || lowerMessage.includes('sneakers')) {
      return "Great choice! Here are some popular footwear options with excellent ratings from our multi-platform catalog.";
    } else if (lowerMessage.includes('accessories') || lowerMessage.includes('handbag') || lowerMessage.includes('sunglasses')) {
      return "Perfect! Here are some stylish accessories from our collection to complete your look.";
    } else if (lowerMessage.includes('electronics') || lowerMessage.includes('computer') || lowerMessage.includes('mobile')) {
      return "Here are some top-rated electronics and tech accessories from Amazon and other retailers!";
    } else if (lowerMessage.includes('grocery') || lowerMessage.includes('food') || lowerMessage.includes('kitchen')) {
      return "Found some great grocery and household items from BigBasket and other stores in our collection!";
    } else if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
      return "Here are the most popular items based on customer reviews and ratings across all our partner stores!";
    } else if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      return "I'll help you find budget-friendly options! Here are some great deals under ₹2,000 from our collection.";
    } else if (lowerMessage.includes('under') && (lowerMessage.includes('50') || lowerMessage.includes('$50'))) {
      return "Perfect! Here are some amazing products under ₹4,150 (equivalent to $50). Great value picks from our collection!";
    } else if (lowerMessage.includes('amazon')) {
      return "Here are some top-rated products from Amazon with verified reviews and ratings!";
    } else if (lowerMessage.includes('bigbasket')) {
      return "Found some excellent grocery and household products from BigBasket for you!";
    } else {
      return "I'm analyzing your request across our entire catalog of 50,000+ products from Amazon, BigBasket, and more. Here are some personalized recommendations!";
    }
  };

  const shouldShowProducts = (message: string) => {
    const productKeywords = ['find', 'show', 'recommend', 'search', 'product', 'buy', 'deal', 'fashion', 'clothing', 'shoes', 'accessories', 'trending'];
    return productKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowChat(true);
    handleSendMessage(suggestion);
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Get personalized product suggestions based on your preferences and shopping history"
    },
    {
      icon: Zap,
      title: "Real-Time Price Comparison",
      description: "Compare prices across multiple retailers to find the best deals instantly"
    },
    {
      icon: Users,
      title: "Social Shopping",
      description: "Share wishlists and get recommendations from friends and family"
    }
  ];

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto p-4 h-screen flex gap-6">
          {/* Header with Navigation Buttons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/mnist')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Brain className="h-4 w-4" />
              MNIST
            </Button>
            <CartButton />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </div>
          
          {/* Suggestion Panel - Hidden on mobile */}
          <div className="hidden lg:block w-80">
            <SuggestionPanel onSuggestionClick={handleSuggestionClick} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Shopping Assistant
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Personal
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Shopping </span>
              Companion
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover products, compare prices, and get personalized recommendations with our AI-powered shopping assistant. 
              Shop smarter with voice commands and real-time deal alerts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow px-8 py-3 text-lg"
                onClick={() => setShowChat(true)}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 text-foreground hover:bg-primary/5 px-6 py-3 text-lg"
                  onClick={() => navigate('/analytics')}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 text-foreground hover:bg-primary/5 px-6 py-3 text-lg"
                  onClick={() => navigate('/mnist')}
                >
                  <Brain className="mr-2 h-5 w-5" />
                  MNIST
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">3+</div>
                <div className="text-sm text-muted-foreground">Partner Stores</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">AI Assistant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Shopping Assistant?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of shopping with AI-powered assistance and personalized recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center bg-gradient-card border-product-card-border shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default ShoppingChat;