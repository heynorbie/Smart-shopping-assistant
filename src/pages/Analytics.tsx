import { ShoppingAnalytics } from '@/components/ShoppingAnalytics';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Button>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shopping Analytics</h1>
                <p className="text-muted-foreground">Insights from your shopping trends data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Component */}
        <ShoppingAnalytics />
      </div>
    </div>
  );
};

export default Analytics;