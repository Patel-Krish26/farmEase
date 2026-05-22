export interface AgriItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  image?: string;
  postedBy?: string;
}
