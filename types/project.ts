export interface Project {
  
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  github?: string;
  liveDemo?: string;
  tags?: string[];
  image?: string; // Optional field for image URL or path
};
