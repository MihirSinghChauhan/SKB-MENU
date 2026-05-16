export type ItemSize = 'S' | 'M';

export interface MenuItemSizePrice {
  S: number;
  M: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price?: number;
  prices?: MenuItemSizePrice;
  desc?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  emoji: string;
  tag: string;
  note?: string;
  hasSizes?: boolean;
  items: MenuItem[];
}

export const MENU: MenuCategory[] = [
  {
    id: "chai", label: "Chai", emoji: "☕", tag: "Hot", note: "Without Sugar +₹10", hasSizes: true,
    items: [
      { id: "c1", name: "Elachi Chai", prices: { S: 20, M: 50 } },
      { id: "c2", name: "Plain Chai", prices: { S: 20, M: 30 } },
      { id: "c3", name: "Adrak Chai", prices: { S: 20, M: 40 } },
      { id: "c4", name: "Masala Chai", prices: { S: 20, M: 50 } },
      { id: "c5", name: "Black Chai", prices: { S: 25, M: 50 } },
      { id: "c6", name: "Chocolate Chai", prices: { S: 25, M: 50 } },
      { id: "c7", name: "Rose Chai", prices: { S: 25, M: 50 } },
      { id: "c8", name: "Vanilla Chai", prices: { S: 30, M: 50 } },
      { id: "c9", name: "Paan Chai", prices: { S: 30, M: 50 } },
      { id: "c10", name: "Kesar Chai", prices: { S: 35, M: 60 } },
      { id: "c11", name: "Ukala", prices: { S: 30, M: 60 } },
    ]
  },
  {
    id: "coffee", label: "Coffee", emoji: "☕", tag: "Hot", note: "Without Sugar +₹10", hasSizes: true,
    items: [
      { id: "cf1", name: "Hot Coffee", prices: { S: 20, M: 50 } },
      { id: "cf2", name: "Strong Hot Coffee", prices: { S: 25, M: 60 } },
      { id: "cf3", name: "Hot Chocolate Coffee", prices: { S: 25, M: 60 } },
      { id: "cf4", name: "Strong Coco Coffee", prices: { S: 25, M: 60 } },
      { id: "cf5", name: "Hazelnut Coffee", prices: { S: 40, M: 70 } },
      { id: "cf6", name: "Caramel Coffee", prices: { S: 40, M: 70 } },
      { id: "cf7", name: "Butterscotch Coffee", prices: { S: 40, M: 70 } },
      { id: "cf8", name: "Pineapple Coffee", prices: { S: 40, M: 70 } },
      { id: "cf9", name: "Mango Coffee", prices: { S: 25, M: 70 } },
      { id: "cf10", name: "Black Coffee", prices: { S: 25, M: 60 } },
    ]
  },
  {
    id: "special-coffee", label: "Special Coffee", emoji: "✨", tag: "Special",
    items: [
      { id: "sc1", name: "Pure Cocoa Coffee", price: 100 },
      { id: "sc2", name: "French Vanilla Coffee", price: 120 },
      { id: "sc3", name: "Irish Mocha Coffee", price: 120 },
    ]
  },
  {
    id: "cold-coffee", label: "Cold Coffee", emoji: "🧊", tag: "Cold", note: "Without Sugar +₹10",
    items: [
      { id: "cc1", name: "Cold Coffee", price: 100 },
      { id: "cc2", name: "Cold Coffee with Ice Cream", price: 130 },
      { id: "cc3", name: "Strong Cold Coffee", price: 120 },
      { id: "cc4", name: "Choco Cold Coffee", price: 130 },
      { id: "cc5", name: "Choco Cold Coffee Icecream", price: 140 },
      { id: "cc6", name: "Brownie Cold Coffee", price: 140 },
      { id: "cc7", name: "Brownie Cold Coffee Icecream", price: 150 },
      { id: "cc8", name: "Caramel Cold Coffee", price: 150 },
      { id: "cc9", name: "Hazelnut Cold Coffee", price: 150 },
      { id: "cc10", name: "Ultimate Cold Coffee", price: 150 },
      { id: "cc11", name: "Tasty Si Cold Coffee", price: 150 },
    ]
  },
  {
    id: "mocktails", label: "Mocktails", emoji: "🍹", tag: "Cold",
    items: [
      { id: "m1", name: "Virgin Mojito", price: 120 },
      { id: "m2", name: "Lychee Cooler", price: 120 },
      { id: "m3", name: "Blue Moon", price: 120 },
      { id: "m4", name: "Green Apple", price: 130 },
      { id: "m5", name: "Cranberry", price: 130 },
      { id: "m6", name: "Citrus Fizz", price: 130 },
      { id: "m7", name: "Cindrella", price: 140 },
      { id: "m8", name: "Watermelon", price: 140 },
      { id: "m9", name: "Strawberry", price: 150 },
      { id: "m10", name: "Pinacolada", price: 150 },
      { id: "m11", name: "Guava", price: 150 },
      { id: "m12", name: "Kaccha Aam", price: 150 },
      { id: "m13", name: "Peach Poison", price: 150 },
    ]
  },
  {
    id: "shakes", label: "Shakes", emoji: "🥤", tag: "Cold",
    items: [
      { id: "sh1", name: "Oreo Shake", price: 120 },
      { id: "sh2", name: "Cadbury Shake", price: 120 },
      { id: "sh3", name: "Kitkat Shake", price: 120 },
      { id: "sh4", name: "Jimjam Shake", price: 130 },
      { id: "sh5", name: "Brownie Shake", price: 140 },
      { id: "sh6", name: "Red Velvet Shake", price: 140 },
    ]
  },
  {
    id: "fries", label: "Fries", emoji: "🍟", tag: "Snacks",
    items: [
      { id: "f1", name: "Classic Fries", price: 120 },
      { id: "f2", name: "Masala Fries", price: 130 },
      { id: "f3", name: "Peri Peri Fries", price: 140 },
      { id: "f4", name: "Cheesy Fries", price: 150 },
      { id: "f5", name: "Loaded Fries", price: 150 },
      { id: "f6", name: "Peri Peri Loaded Fries", price: 160 },
    ]
  },
  {
    id: "pizza", label: "Pizza", emoji: "🍕", tag: "Mains",
    items: [
      { id: "pz1", name: "Bread Pizza", price: 90 },
      { id: "pz2", name: "Margherita Pizza", price: 100 },
      { id: "pz3", name: "Veggie Pizza", price: 120 },
      { id: "pz4", name: "Corn Pizza", price: 130 },
      { id: "pz5", name: "Onion Pizza", price: 130 },
      { id: "pz6", name: "Double Cheese Pizza", price: 140 },
      { id: "pz7", name: "Corn & Onion Pizza", price: 140 },
      { id: "pz8", name: "Paneer Makhni Pizza", price: 150 },
      { id: "pz9", name: "Olive Baby Corn Pizza", price: 150 },
      { id: "pz10", name: "Cheese Burst Pizza", price: 180 },
      { id: "pz11", name: "Paneer Tandoori Pizza", price: 180 },
      { id: "pz12", name: "Veg Paradise Pizza", price: 200 },
      { id: "pz13", name: "Farm House Pizza", price: 200 }
    ]
  },
  {
    id: "burger", label: "Burger", emoji: "🍔", tag: "Mains",
    items: [
      { id: "bg1", name: "Aloo Tikki Burger", price: 100 },
      { id: "bg2", name: "Veg Burger", price: 100 },
      { id: "bg3", name: "Veg Schezwan Burger", price: 120 },
      { id: "bg4", name: "Veg Cheese Burger", price: 130 },
      { id: "bg5", name: "Paneer Burger", price: 130 },
      { id: "bg6", name: "Paneer Cheese Burger", price: 150 },
      { id: "bg7", name: "Spinach & Corn Burger", price: 150 },
      { id: "bg8", name: "Herb Cheese Chilly Burger", price: 160 }
    ]
  },
  {
    id: "combos", label: "Combos", emoji: "🍱", tag: "Value",
    items: [
      { id: "co1", name: "Chole Kulche", price: 150, desc: "A classic favourite!" },
      { id: "co2", name: "Golden Trio", price: 150, desc: "Bread Pizza + Classic Fries" },
      { id: "co3", name: "Flavored Fusion Platter", price: 250, desc: "Potato + Veg Burger + Garlic" },
      { id: "co4", name: "Swaad Ki Shaan", price: 300, desc: "Nachos + Fries + Cheese Garlic" }
    ]
  }
];

export const TAG_COLORS: Record<string, string> = {
  "Hot": "text-orange-500 bg-orange-500/10 border-orange-500/20",
  "Cold": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  "Special": "text-purple-500 bg-purple-500/10 border-purple-500/20",
  "Wellness": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  "Drinks": "text-teal-500 bg-teal-500/10 border-teal-500/20",
  "Light Bites": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  "Snacks": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Starters": "text-green-500 bg-green-500/10 border-green-500/20",
  "Mains": "text-pink-500 bg-pink-500/10 border-pink-500/20",
  "Value": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "Dessert": "text-rose-400 bg-rose-400/10 border-rose-400/20",
  "Extras": "text-slate-400 bg-slate-400/10 border-slate-400/20",
};
