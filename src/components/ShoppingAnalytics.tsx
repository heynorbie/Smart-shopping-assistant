import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ShoppingTrend, CategoryAnalytics, LocationAnalytics } from '@/types/shopping';
import { loadShoppingTrendsData } from '@/utils/csvParser';
import { TrendingUp, Users, DollarSign, ShoppingBag, MapPin, Star } from 'lucide-react';

export const ShoppingAnalytics = () => {
  const [data, setData] = useState<ShoppingTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const trends = await loadShoppingTrendsData();
        setData(trends);
      } catch (error) {
        console.error('Failed to load shopping data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const analytics = useMemo(() => {
    if (!data.length) return null;

    // Category analytics
    const categoryMap = new Map<string, CategoryAnalytics>();
    data.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          category: item.category,
          totalSales: 0,
          averageRating: 0,
          itemCount: 0
        });
      }
      const cat = categoryMap.get(item.category)!;
      cat.totalSales += item.purchaseAmount;
      cat.averageRating = (cat.averageRating * cat.itemCount + item.reviewRating) / (cat.itemCount + 1);
      cat.itemCount += 1;
    });
    const categoryAnalytics = Array.from(categoryMap.values()).sort((a, b) => b.totalSales - a.totalSales);

    // Location analytics
    const locationMap = new Map<string, LocationAnalytics>();
    data.forEach(item => {
      if (!locationMap.has(item.location)) {
        locationMap.set(item.location, {
          location: item.location,
          totalSales: 0,
          customerCount: 0,
          averageOrderValue: 0
        });
      }
      const loc = locationMap.get(item.location)!;
      loc.totalSales += item.purchaseAmount;
      loc.customerCount += 1;
      loc.averageOrderValue = loc.totalSales / loc.customerCount;
    });
    const locationAnalytics = Array.from(locationMap.values())
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);

    // Season trends
    const seasonMap = new Map<string, number>();
    data.forEach(item => {
      seasonMap.set(item.season, (seasonMap.get(item.season) || 0) + item.purchaseAmount);
    });
    const seasonTrends = Array.from(seasonMap.entries()).map(([season, sales]) => ({ season, sales }));

    // Age demographics
    const ageGroups = [
      { range: '18-25', min: 18, max: 25 },
      { range: '26-35', min: 26, max: 35 },
      { range: '36-45', min: 36, max: 45 },
      { range: '46-55', min: 46, max: 55 },
      { range: '56-65', min: 56, max: 65 },
      { range: '65+', min: 66, max: 100 }
    ];
    const ageDemographics = ageGroups.map(group => ({
      range: group.range,
      count: data.filter(item => item.age >= group.min && item.age <= group.max).length,
      totalSpent: data.filter(item => item.age >= group.min && item.age <= group.max)
        .reduce((sum, item) => sum + item.purchaseAmount, 0)
    }));

    return {
      totalCustomers: data.length,
      totalRevenue: data.reduce((sum, item) => sum + item.purchaseAmount, 0),
      averageOrderValue: data.reduce((sum, item) => sum + item.purchaseAmount, 0) / data.length,
      averageRating: data.reduce((sum, item) => sum + item.reviewRating, 0) / data.length,
      categoryAnalytics,
      locationAnalytics,
      seasonTrends,
      ageDemographics
    };
  }, [data]);

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading shopping analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                  <Bar dataKey="totalSales" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryAnalytics}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="itemCount"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.categoryAnalytics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top 10 Locations by Sales</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics.locationAnalytics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="location" type="category" width={100} />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Bar dataKey="totalSales" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="seasons" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Seasonal Sales Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.seasonTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Count by Age Group</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ageDemographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Spending by Age Group</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ageDemographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Total Spent']} />
                  <Bar dataKey="totalSpent" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};