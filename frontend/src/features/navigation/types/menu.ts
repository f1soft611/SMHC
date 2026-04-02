export type MenuStatus = 'ready' | 'coming-soon';
export type MenuTone = 'primary' | 'secondary' | 'success' | 'warning' | 'info';

export interface MenuItem {
  id: string;
  label: string;
  status: MenuStatus;
  description: string;
  objective: string;
  highlight: string;
  tone: MenuTone;
}

export interface MenuCategory {
  id: string;
  label: string;
  description: string;
  summary: string;
  tone: MenuTone;
  items: MenuItem[];
}

export interface MenuSelection {
  categoryId: string;
  itemId: string;
}
