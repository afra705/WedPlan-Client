import {
  Camera,
  Flower2,
  Landmark,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  name: string;
  description: string;
  icon: LucideIcon;
};

// These names match the categories vendors choose when adding a service.
export const categories: Category[] = [
  {
    name: "Photography & Videography",
    description: "Capture every smile, tear, and celebration.",
    icon: Camera,
  },
  {
    name: "Wedding Venues",
    description: "Find the perfect place to say I do.",
    icon: Landmark,
  },
  {
    name: "Decoration & Florist",
    description: "Beautiful flowers, stages, and wedding decor.",
    icon: Flower2,
  },
  {
    name: "Catering Services",
    description: "Delicious food and menus for your guests.",
    icon: UtensilsCrossed,
  },
  {
    name: "Makeup & Styling",
    description: "Look and feel your best on the big day.",
    icon: Sparkles,
  },
  {
    name: "Wedding Fashion",
    description: "Bridal wear, groom outfits, and accessories.",
    icon: Shirt,
  },
];
