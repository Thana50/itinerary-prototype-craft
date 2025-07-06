
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleSidebar
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded"></div>
          </div>
          <span className="font-semibold text-gray-900">Travia Templates</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search destinations, activities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default SidebarHeader;
