import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MNISTDataset, MNISTStats, MNISTImage } from '@/types/mnist';
import { MNISTParser } from '@/utils/mnistParser';
import { ChevronLeft, ChevronRight, Shuffle, BarChart3, Eye, Brain } from 'lucide-react';

export const MNISTViewer = () => {
  const [testDataset, setTestDataset] = useState<MNISTDataset | null>(null);
  const [stats, setStats] = useState<MNISTStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dataset = await MNISTParser.loadDataset(
          '/mnist/t10k-images-idx3-ubyte',
          '/mnist/t10k-labels-idx1-ubyte'
        );
        setTestDataset(dataset);
        setStats(MNISTParser.calculateStats(dataset));
      } catch (error) {
        console.error('Failed to load MNIST data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (testDataset && canvasRef.current) {
      const image = testDataset.images[currentIndex];
      if (image) {
        MNISTParser.imageToCanvas(image, canvasRef.current, 10);
      }
    }
  }, [testDataset, currentIndex]);

  const handlePrevious = () => {
    if (testDataset) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testDataset.images.length - 1));
    }
  };

  const handleNext = () => {
    if (testDataset) {
      setCurrentIndex((prev) => (prev < testDataset.images.length - 1 ? prev + 1 : 0));
    }
  };

  const handleRandom = () => {
    if (testDataset) {
      setCurrentIndex(Math.floor(Math.random() * testDataset.images.length));
    }
  };

  const handleDigitFilter = (digit: number) => {
    if (!testDataset) return;
    
    if (selectedDigit === digit) {
      setSelectedDigit(null);
      return;
    }

    setSelectedDigit(digit);
    const indices = testDataset.labels
      .map((label, index) => ({ label, index }))
      .filter(item => item.label === digit)
      .map(item => item.index);
    
    if (indices.length > 0) {
      setCurrentIndex(indices[Math.floor(Math.random() * indices.length)]);
    }
  };

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading MNIST dataset...</p>
      </div>
    );
  }

  if (!testDataset || !stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Failed to load MNIST data</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.digitCounts).map(([digit, count]) => ({
    digit: `Digit ${digit}`,
    count,
    digitNum: parseInt(digit)
  }));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Images</p>
              <p className="text-2xl font-bold">{stats.totalImages.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Image Size</p>
              <p className="text-2xl font-bold">{testDataset.width}×{testDataset.height}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Brightness</p>
              <p className="text-2xl font-bold">{stats.averagePixelIntensity.toFixed(1)}</p>
            </div>
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="viewer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="viewer">Image Viewer</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="viewer" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Display */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Current Image</h3>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Label: {testDataset.labels[currentIndex]}
                  </Badge>
                </div>
                
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-border rounded-lg shadow-sm bg-white"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Image {currentIndex + 1} of {testDataset.images.length}
                  </span>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRandom}>
                    <Shuffle className="h-4 w-4" />
                    Random
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Digit Filter */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Filter by Digit</h3>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <Button
                    key={digit}
                    variant={selectedDigit === digit ? "default" : "outline"}
                    className="aspect-square text-lg font-bold"
                    onClick={() => handleDigitFilter(digit)}
                  >
                    {digit}
                  </Button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <h4 className="font-medium">Digit Counts:</h4>
                {Object.entries(stats.digitCounts).map(([digit, count]) => (
                  <div key={digit} className="flex justify-between text-sm">
                    <span>Digit {digit}:</span>
                    <span className="font-mono">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Digit Distribution (Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="digit" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Digit Distribution (Pie Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ digit, percent }) => `${digit}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.digitNum % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Random Sample Gallery</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {Array.from({ length: 20 }, (_, i) => {
                const randomIndex = Math.floor(Math.random() * testDataset.images.length);
                return (
                  <div key={i} className="text-center">
                    <canvas
                      width={28}
                      height={28}
                      className="border border-border rounded bg-white mx-auto mb-1"
                      style={{ imageRendering: 'pixelated', width: '56px', height: '56px' }}
                      ref={(canvas) => {
                        if (canvas) {
                          MNISTParser.imageToCanvas(testDataset.images[randomIndex], canvas, 2);
                        }
                      }}
                    />
                    <Badge variant="outline" className="text-xs">
                      {testDataset.labels[randomIndex]}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};