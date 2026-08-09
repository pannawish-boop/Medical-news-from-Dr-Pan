import React from 'react';
import { ArticleCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import { Brain, Zap, BookOpen, Activity, Cpu, Layers } from 'lucide-react';

interface Props {
  selectedCategory: ArticleCategory | 'all';
  onSelectCategory: (category: ArticleCategory | 'all') => void;
  articleCounts: Record<ArticleCategory | 'all', number>;
}

export const CategoryFilterTabs: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  articleCounts,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'asd': return <Brain className="w-4 h-4" />;
      case 'adhd': return <Zap className="w-4 h-4" />;
      case 'ld': return <BookOpen className="w-4 h-4" />;
      case 'tics': return <Activity className="w-4 h-4" />;
      case 'tms': return <Cpu className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div id="category-tabs-container" className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>เลือกหมวดหมู่บทความการแพทย์</span>
          <span className="text-xs font-normal text-slate-500">(5 หมวดหมู่หลักโดย Doctor PAN Clinic)</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* All Categories Button */}
        <button
          id="category-tab-all"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 font-bold'
              : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>บทความทั้งหมด</span>
          <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            selectedCategory === 'all' ? 'bg-teal-900/60 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {articleCounts.all || 0}
          </span>
        </button>

        {/* 5 Categories */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = articleCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`category-tab-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
              }`}
            >
              <span className={isSelected ? 'text-teal-200' : 'text-teal-600'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.nameTh}</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-teal-900/60 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
