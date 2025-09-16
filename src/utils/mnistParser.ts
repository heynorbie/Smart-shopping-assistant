import { MNISTDataset, MNISTStats } from '@/types/mnist';

// MNIST file format parsers
export class MNISTParser {
  static async loadImages(url: string): Promise<{ images: number[][][]; width: number; height: number }> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = new DataView(buffer);

    // Read header
    const magic = data.getUint32(0, false);
    const numImages = data.getUint32(4, false);
    const numRows = data.getUint32(8, false);
    const numCols = data.getUint32(12, false);

    if (magic !== 0x00000803) {
      throw new Error('Invalid MNIST image file magic number');
    }

    const images: number[][][] = [];
    let offset = 16;

    for (let i = 0; i < numImages; i++) {
      const image: number[][] = [];
      for (let row = 0; row < numRows; row++) {
        const rowData: number[] = [];
        for (let col = 0; col < numCols; col++) {
          rowData.push(data.getUint8(offset++));
        }
        image.push(rowData);
      }
      images.push(image);
    }

    return { images, width: numCols, height: numRows };
  }

  static async loadLabels(url: string): Promise<number[]> {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = new DataView(buffer);

    // Read header
    const magic = data.getUint32(0, false);
    const numLabels = data.getUint32(4, false);

    if (magic !== 0x00000801) {
      throw new Error('Invalid MNIST label file magic number');
    }

    const labels: number[] = [];
    for (let i = 0; i < numLabels; i++) {
      labels.push(data.getUint8(8 + i));
    }

    return labels;
  }

  static async loadDataset(imageUrl: string, labelUrl: string): Promise<MNISTDataset> {
    const [imageData, labels] = await Promise.all([
      this.loadImages(imageUrl),
      this.loadLabels(labelUrl)
    ]);

    return {
      images: imageData.images,
      labels,
      width: imageData.width,
      height: imageData.height
    };
  }

  static calculateStats(dataset: MNISTDataset): MNISTStats {
    const digitCounts: Record<number, number> = {};
    let totalPixelIntensity = 0;
    let totalPixels = 0;

    // Initialize digit counts
    for (let i = 0; i < 10; i++) {
      digitCounts[i] = 0;
    }

    // Count labels and calculate average pixel intensity
    dataset.labels.forEach((label, index) => {
      digitCounts[label]++;
      
      const image = dataset.images[index];
      for (let row = 0; row < image.length; row++) {
        for (let col = 0; col < image[row].length; col++) {
          totalPixelIntensity += image[row][col];
          totalPixels++;
        }
      }
    });

    return {
      totalImages: dataset.labels.length,
      digitCounts,
      averagePixelIntensity: totalPixelIntensity / totalPixels
    };
  }

  static imageToCanvas(image: number[][], canvas: HTMLCanvasElement, scale: number = 1): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = image[0].length;
    const height = image.length;
    
    canvas.width = width * scale;
    canvas.height = height * scale;

    const imageData = ctx.createImageData(width * scale, height * scale);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = image[y][x];
        
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const index = ((y * scale + sy) * width * scale + (x * scale + sx)) * 4;
            imageData.data[index] = pixel;     // R
            imageData.data[index + 1] = pixel; // G
            imageData.data[index + 2] = pixel; // B
            imageData.data[index + 3] = 255;   // A
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
}