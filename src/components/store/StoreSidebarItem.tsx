
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const StoreSidebarItem = () => {
  const location = useLocation();
  const isActive = location.pathname === '/store';

  React.useEffect(() => {
    // Find the sidebar nav element
    const sidebarNav = document.querySelector('nav ul');
    
    // If the sidebar exists and our custom item doesn't exist yet
    if (sidebarNav && !document.getElementById('store-nav-item')) {
      // Create our new nav item
      const storeNavItem = document.createElement('li');
      storeNavItem.id = 'store-nav-item';
      
      // Render our component into the new element
      const root = document.createElement('div');
      root.className = 'w-full';
      storeNavItem.appendChild(root);
      
      // Insert before the last item (usually settings)
      sidebarNav.insertBefore(storeNavItem, sidebarNav.lastElementChild);
      
      // Create the actual link
      const link = document.createElement('a');
      link.href = '/store';
      link.className = `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`;
      
      // Create icon
      const icon = document.createElement('div');
      icon.className = 'w-5 h-5 text-primary';
      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
      link.appendChild(icon);
      
      // Create text
      const text = document.createElement('span');
      text.textContent = 'Store';
      text.className = 'text-sm font-medium';
      link.appendChild(text);
      
      root.appendChild(link);
      
      // Handle clicks
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/store';
      });
    }
  }, [isActive]);

  return null; // This component doesn't render anything directly
};

export default StoreSidebarItem;
