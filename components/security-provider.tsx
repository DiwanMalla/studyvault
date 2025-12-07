'use client';

import { useEffect } from 'react';

export default function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+C / Cmd+C (Copy) - optional, might be too aggressive
      // if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      //   e.preventDefault();
      //   return false;
      // }
      
      // Prevent F12 (DevTools) - best effort
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    // Disable right-click globally
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return <>{children}</>;
}
