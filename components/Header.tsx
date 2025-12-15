import React from 'react';
import { Syringe } from 'lucide-react';

const Header: React.FC = () => (
  <div className="pt-8 pb-6 px-4 text-center no-print">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
          <Syringe className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">儿童免疫接种评估</h1>
      <p className="text-slate-500 text-sm mt-1">基于 CDC / ACIP 指南的临床辅助决策</p>
  </div>
);

export default Header;