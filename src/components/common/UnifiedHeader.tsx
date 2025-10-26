import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, ArrowLeft, Brain, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface UnifiedHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showNotifications?: boolean;
  showLogout?: boolean;
  showBackButton?: boolean;
  backUrl?: string;
  showAIBadge?: boolean;
  showHelpButton?: boolean;
  userName?: string;
  rightContent?: React.ReactNode;
  onLogout?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  showNotifications = true,
  showLogout = true,
  showBackButton = false,
  backUrl,
  showAIBadge = false,
  showHelpButton = false,
  userName,
  rightContent,
  onLogout
}) => {
  const navigate = useNavigate();

  return (
    <header className="glass-card border-b shadow-lg px-6 py-4 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && backUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backUrl)}
              className="hover:bg-background/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          {showLogo && (
            <img 
              src="/lovable-uploads/0eec4e7f-1447-475b-928f-96fbc0eca6e8.png" 
              alt="Travia Logo" 
              className="h-14 w-auto"
            />
          )}
          
          {title && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showAIBadge && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20">
              <Brain className="h-3 w-3" />
              AI Enhanced
            </Badge>
          )}
          
          {userName && (
            <span className="text-sm text-muted-foreground">
              Welcome, {userName}
            </span>
          )}
          
          {showNotifications && <NotificationBell />}
          
          {showHelpButton && (
            <Button variant="ghost" size="sm" className="hover:bg-background/50">
              <HelpCircle className="h-4 w-4 mr-1" />
              Need Help?
            </Button>
          )}
          
          {rightContent}
          
          {showLogout && onLogout && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
