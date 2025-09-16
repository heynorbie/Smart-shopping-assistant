import { MNISTViewer } from '@/components/MNISTViewer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MNIST = () => {
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
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">MNIST Dataset Viewer</h1>
                <p className="text-muted-foreground">Explore the famous handwritten digits dataset</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-4">
            <Database className="h-6 w-6 text-primary mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">About MNIST Dataset</h2>
              <p className="text-muted-foreground mb-3">
                The MNIST database is a large database of handwritten digits commonly used for training 
                and testing machine learning algorithms. It consists of 70,000 grayscale images of 
                handwritten digits (0-9), each 28×28 pixels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Training Set:</span> 60,000 images
                </div>
                <div>
                  <span className="font-medium">Test Set:</span> 10,000 images
                </div>
                <div>
                  <span className="font-medium">Image Size:</span> 28×28 pixels
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MNIST Viewer Component */}
        <MNISTViewer />
      </div>
    </div>
  );
};

export default MNIST;