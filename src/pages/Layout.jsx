import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2,
  CreditCard,
  FileText,
  FileStack,
  Handshake,
  BookOpen,
  Menu,
  X,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const navigationItems = [
  {
    title: "Tableau de bord",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Missions",
    url: createPageUrl("Missions"),
    icon: Briefcase,
  },
  {
    title: "Intérimaires",
    url: createPageUrl("Interimaires"),
    icon: Users,
  },
  {
    title: "Entreprises",
    url: createPageUrl("Entreprises"),
    icon: Building2,
  },
  {
    title: "Paiements",
    url: createPageUrl("Paiements"),
    icon: CreditCard,
  },
  {
    title: "Fiches de paie",
    url: createPageUrl("FichesPaie"),
    icon: FileText,
  },
  {
    title: "Documents",
    url: createPageUrl("Documents"),
    icon: FileStack,
  },
  {
    title: "Contrats",
    url: createPageUrl("Contrats"),
    icon: Handshake,
  },
  {
    title: "Guide",
    url: createPageUrl("Guide"),
    icon: BookOpen,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    const roleColors = {
      admin: 'bg-red-100 text-red-700',
      entreprise: 'bg-blue-100 text-blue-700',
      interimaire: 'bg-green-100 text-green-700',
    };
    return roleColors[user?.role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 214 88% 27%;
          --primary-foreground: 0 0% 100%;
          --secondary: 17 88% 60%;
          --accent: 214 100% 97%;
          --muted: 214 20% 95%;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Omnivyn</h2>
                <p className="text-xs text-slate-500">Intérim</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            transition-all duration-200 rounded-xl mb-1
                            ${isActive 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                              : 'hover:bg-slate-100 text-slate-700'
                            }
                          `}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4 space-y-3">
            {/* Info utilisateur */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                {user?.role && (
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge()}`}>
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            {/* Bouton de déconnexion */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-bold text-slate-900">Omnivyn Intérim</h1>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
