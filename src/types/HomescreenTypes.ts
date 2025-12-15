

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// Define the properties for the main video component
export interface VideoData {
  id: number;
  title: string;
  creator: string;
  videoUrl: string;
  products: Product[]; // Products featured in the video
}