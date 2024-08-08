import React, { ReactNode } from 'react';
import OperatorSidebar from './sidebar';

interface OperatorLayoutProps {
  children: ReactNode;
}

const OperatorLayout: React.FC<OperatorLayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-[#3d3c3f] bg-opacity-90">
      <OperatorSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default OperatorLayout;
