import React, { ReactNode } from 'react';
import OperatorSidebar from './sidebar';

interface OperatorLayoutProps {
  children: ReactNode;
}

const OperatorLayout: React.FC<OperatorLayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-[#f9f9f9] bg-opacity-90 h-screen">
      <OperatorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default OperatorLayout;
