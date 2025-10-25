
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { negotiationService } from "@/services/negotiationService";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const VendorDashboardHeader = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, completed: 0 });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const negotiations = await negotiationService.getVendorNegotiations(user.id);
      const pending = negotiations.filter(n => n.status === 'pending' || n.status === 'negotiating').length;
      const completed = negotiations.filter(n => n.status === 'accepted' || n.status === 'rejected').length;
      setStats({ pending, completed });
    } catch (error) {
      console.error('Error loading vendor stats:', error);
    }
  };

  return (
    <div className="glass-card border-b shadow-lg relative z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-primary-foreground">LOGO</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Phuket Beach Resort & Spa
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Welcome back, Reservation Manager</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-muted-foreground">📍 Phuket, Thailand</span>
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg">
                  <Award className="h-3 w-3 mr-1" />
                  Gold Partner
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20 shadow-lg">
              <p className="text-sm text-muted-foreground">Live Stats</p>
              <p className="font-semibold text-lg">
                {stats.pending} pending requests
              </p>
              <p className="text-sm text-muted-foreground">{stats.completed} completed this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardHeader;
