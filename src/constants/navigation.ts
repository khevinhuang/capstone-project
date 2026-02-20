import { Home, Package, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  end?: boolean;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    end: true,
  },
  {
    label: 'Product',
    href: '/product',
    icon: Package,
  },
];
