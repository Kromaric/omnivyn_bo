import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function PaiementsStats({ paiements, loading }) {
  const stats = {
    total: paiements.reduce((sum, p) => sum + (p.montant || 0), 0),
    enAttente: paiements.filter(p => p.statut === "en_attente").reduce((sum, p) => sum + (p.montant || 0), 0),
    payes: paiements.filter(p => p.statut === "paye").reduce((sum, p) => sum + (p.montant || 0), 0),
    annules: paiements.filter(p => p.statut === "annule").length
  };

  const cards = [
    {
      title: "Total",
      value: `${stats.total.toLocaleString('fr-FR')}€`,
      icon: DollarSign,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "En attente",
      value: `${stats.enAttente.toLocaleString('fr-FR')}€`,
      icon: Clock,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      title: "Payés",
      value: `${stats.payes.toLocaleString('fr-FR')}€`,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100"
    },
    {
      title: "Annulés",
      value: stats.annules,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100"
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
          <Card className={`border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br ${card.bgGradient}`}>
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
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}