export interface MNISTImage {
  data: number[][];
  label: number;
  index: number;
}

export interface MNISTDataset {
  images: number[][][];
  labels: number[];
  width: number;
  height: number;
}

export interface MNISTStats {
  totalImages: number;
  digitCounts: Record<number, number>;
  averagePixelIntensity: number;
}