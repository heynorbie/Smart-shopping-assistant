import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, MessageSquare, BarChart3, Database, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CartButton } from "@/components/CartButton";
import { CartSidebar } from "@/components/CartSidebar";
import heroImage from "@/assets/hero-shopping-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="relative overflow-hidden bg-hero-gradient border-b border-hero-border">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-hero-text-primary via-hero-text-secondary to-hero-text-accent bg-clip-text text-transparent">
                ShopSmart AI
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/shopping-chat" className="text-hero-text-muted hover:text-hero-text-primary transition-colors">
                AI Assistant
              </Link>
              <Link to="/analytics" className="text-hero-text-muted hover:text-hero-text-primary transition-colors">
                Analytics
              </Link>
              <Link to="/mnist" className="text-hero-text-muted hover:text-hero-text-primary transition-colors">
                MNIST
              </Link>
              <CartButton />
            </nav>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-hero-text-primary to-hero-text-secondary bg-clip-text text-transparent">
                    Smart Shopping
                  </span>
                  <br />
                  <span className="text-hero-text-primary">Made Simple</span>
                </h2>
                <p className="text-xl text-hero-text-muted leading-relaxed max-w-lg">
                  Discover thousands of products with AI-powered recommendations, real-time analytics, and intelligent search across multiple platforms.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group" asChild>
                  <Link to="/shopping-chat">
                    <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Shopping
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-hero-border hover:bg-hero-accent/10" asChild>
                  <Link to="/analytics">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-110"></div>
              <img 
                src={heroImage} 
                alt="Shopping experience" 
                className="relative rounded-3xl shadow-hero w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-section-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-section-heading mb-4">
              Everything You Need for Smart Shopping
            </h3>
            <p className="text-section-text max-w-2xl mx-auto text-lg">
              Powered by advanced AI and comprehensive data analysis to give you the best shopping experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 bg-card-background border-card-border hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-elegant">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-semibold mb-4 text-card-heading">
                  {feature.title}
                </h4>
                <p className="text-card-text leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-4xl font-bold text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-section-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-4xl font-bold text-section-heading">
              Ready to Transform Your Shopping Experience?
            </h3>
            <p className="text-xl text-section-text">
              Join thousands of smart shoppers who use our AI-powered platform to find the best deals and products.
            </p>
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group" asChild>
              <Link to="/shopping-chat">
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer-background border-t border-footer-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-footer-text font-semibold">ShopSmart AI</span>
            </div>
            <p className="text-footer-muted text-sm">
              © 2024 ShopSmart AI. Powered by advanced analytics and AI.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

const features = [
  {
    icon: MessageSquare,
    title: "AI Shopping Assistant",
    description: "Get personalized product recommendations and smart shopping advice powered by advanced AI technology."
  },
  {
    icon: Database,
    title: "Multi-Platform Search",
    description: "Search across Amazon, Flipkart, and other major platforms to find the best deals and products in one place."
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Analyze shopping trends, compare prices, and make data-driven purchasing decisions with comprehensive insights."
  },
  {
    icon: ShoppingBag,
    title: "Unified Shopping Cart",
    description: "Add products from multiple sources to your cart and manage your shopping list efficiently."
  },
  {
    icon: Sparkles,
    title: "Price Comparison",
    description: "Automatically compare prices across platforms and get alerts for the best deals and discounts."
  },
  {
    icon: ArrowRight,
    title: "Quick Checkout",
    description: "Streamlined checkout process with secure payment options and order tracking capabilities."
  }
];

const stats = [
  { value: "15K+", label: "Products Available" },
  { value: "Multiple", label: "Shopping Platforms" },
  { value: "AI-Powered", label: "Recommendations" },
  { value: "Real-time", label: "Price Updates" }
];

export default Index;