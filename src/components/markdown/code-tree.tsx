import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  content?: string;
  language?: string;
}

interface CodeTreeProps {
  items: TreeItem[];
  onSelectFile?: (file: TreeItem) => void;
}

const CodeTree: React.FC<CodeTreeProps> = ({ items, onSelectFile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-12 items-center px-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="mr-2"
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </Button>
        <h2 className="text-sm font-semibold">Explorer</h2>
      </div>
      
      <div className={cn(
        "overflow-auto h-full transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"
      )}>
        <div className="text-sm p-2">
          <TreeItems items={items} level={0} onSelectFile={onSelectFile} />
        </div>
      </div>
    </div>
  );
};

interface TreeItemsProps {
  items: TreeItem[];
  level: number;
  onSelectFile?: (file: TreeItem) => void;
}

const TreeItems: React.FC<TreeItemsProps> = ({ items, level, onSelectFile }) => {
  return (
    <ul className="pl-2">
      {items.map((item, index) => (
        <TreeNode 
          key={index} 
          item={item} 
          level={level} 
          onSelectFile={onSelectFile} 
        />
      ))}
    </ul>
  );
};

interface TreeNodeProps {
  item: TreeItem;
  level: number;
  onSelectFile?: (file: TreeItem) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, level, onSelectFile }) => {
  const [expanded, setExpanded] = useState(level < 1);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleFileClick = () => {
    if (item.type === "file" && onSelectFile) {
      onSelectFile(item);
    }
  };

  return (
    <li className="py-1">
      <div 
        className={cn(
          "flex items-center rounded px-1 py-0.5",
          item.type === "file" ? "cursor-pointer hover:bg-accent" : "hover:bg-muted",
        )}
        onClick={item.type === "folder" ? handleToggle : handleFileClick}
      >
        {item.type === "folder" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 mr-1"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
        {item.type === "folder" ? (
          <Folder className="h-4 w-4 mr-1.5 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 mr-1.5 text-muted-foreground" />
        )}
        <span className={item.type === "file" ? "text-foreground" : "font-medium"}>{item.name}</span>
      </div>
      {item.type === "folder" && expanded && item.children && (
        <TreeItems items={item.children} level={level + 1} onSelectFile={onSelectFile} />
      )}
    </li>
  );
};

export default CodeTree; 