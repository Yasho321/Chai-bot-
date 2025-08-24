import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  MessageCircle, 
  BookOpen, 
  FileText, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Settings
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

const Sidebar = ({ onNavigate, currentView }) => {
  const { authUser } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAdmin = authUser?.role === 'admin';

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, available: true },
    ...(isAdmin ? [
      { id: 'courses', label: 'Courses', icon: BookOpen, available: true },
      { id: 'chapters', label: 'Chapters', icon: FileText, available: true },
      { id: 'upload', label: 'Upload VTT', icon: Upload, available: true },
    ] : []),
  ];

  return (
    <div className={`relative border-r border-border bg-sidebar transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 rounded-full border border-border bg-background hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="flex flex-col h-full p-4">
        {/* Navigation Menu */}
        <ScrollArea className="flex-1">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start transition-colors ${
                  isCollapsed ? 'px-2' : 'px-3'
                } ${currentView === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-hover'}`}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && item.label}
              </Button>
            ))} 
          </nav>

          {!isCollapsed && (
            <>
              <Separator className="my-4" />
              
              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-sidebar-foreground/70 px-3">
                  Quick Actions
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-hover"
                  onClick={() => onNavigate('chat')}
                >
                  <Plus className="h-4 w-4 mr-3" />
                  New Chat
                </Button>
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-hover"
                    onClick={() => onNavigate('courses')}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    New Course
                  </Button>
                )}
              </div>
            </>
          )}
        </ScrollArea>

        {!isCollapsed && (
          <div className="pt-4 border-t border-sidebar-border">
            <div className="px-3 py-2">
              <p className="text-xs text-sidebar-foreground/60">
                {isAdmin ? 'Administrator Panel' : 'Student Dashboard'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;