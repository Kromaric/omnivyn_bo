import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function GraphiqueActivite({ missions, loading }) {
  const getLast6Months = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        name: d.toLocaleDateString('fr-FR', { month: 'short' }),
        mois: d.getMonth(),
        annee: d.getFullYear()
      });
    }
    return months;
  };

  const getChartData = () => {
    const months = getLast6Months();
    return months.map(month => {
      const missionsMonth = missions.filter(m => {
        const date = new Date(m.date_debut);
        return date.getMonth() === month.mois && date.getFullYear() === month.annee;
      });
      
      return {
        mois: month.name,
        "Missions ouvertes": missionsMonth.filter(m => m.statut === "ouverte").length,
        "Missions en cours": missionsMonth.filter(m => m.statut === "en_cours").length,
        "Missions terminées": missionsMonth.filter(m => m.statut === "terminee").length
      };
    });
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">
          Activité sur 6 mois
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="mois" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="Missions ouvertes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Missions en cours" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Missions terminées" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}