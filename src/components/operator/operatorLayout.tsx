// components/operator/operatorLayout.tsx

import React, { ReactNode } from 'react';
import OperatorSidebar from './sidebar';

interface OperatorLayoutProps {
  children: ReactNode;
}

const OperatorLayout: React.FC<OperatorLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f9f9f9] overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-64 bg-white shadow-md">
        <OperatorSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 bg-[#f9f9f9] p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default OperatorLayout;
