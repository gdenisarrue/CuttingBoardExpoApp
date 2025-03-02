import { create } from 'zustand';

export interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  department: string;
}

interface ShoppingState {
  items: ShoppingItem[];
  addItem: (item: ShoppingItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  moveItem: (id: string, toDepartment: string) => void;
  clearAllItems: () => void;
}

export const useShoppingStore = create<ShoppingState>((set) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  
  toggleItem: (id) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  })),
  
  moveItem: (id, toDepartment) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, department: toDepartment } : item
    )
  })),
  
  clearAllItems: () => set({ items: [] }),
}));