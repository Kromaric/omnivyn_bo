import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Building2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function StatsGrid({ stats, loading }) {
  const cards = [
    {
      title: "Missions actives",
      value: stats.missionsActives,
      subtitle: `${stats.missionsOuvertes} ouvertes`,
      icon: Briefcase,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Intérimaires",
      value: stats.interimairesDisponibles,
      subtitle: `sur ${stats.interimairesTotal} total`,
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100"
    },
    {
      title: "Entreprises actives",
      value: stats.entreprisesActives,
      subtitle: "Clientes",
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Revenu mensuel estimé",
      value: `${Math.round(stats.revenuMensuel).toLocaleString('fr-FR')}€`,
      subtitle: "Ce mois",
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`relative overflow-hidden border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br ${card.bgGradient}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {loading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {card.value}
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{card.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}