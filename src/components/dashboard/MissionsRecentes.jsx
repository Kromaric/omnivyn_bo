import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  ouverte: { label: "Ouverte", className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_cours: { label: "En cours", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  terminee: { label: "Terminée", className: "bg-slate-100 text-slate-700 border-slate-200" },
  annulee: { label: "Annulée", className: "bg-red-100 text-red-700 border-red-200" }
};

export default function MissionsRecentes({ missions, loading }) {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-slate-900">
            Missions récentes
          </CardTitle>
          <Link to={createPageUrl("Missions")}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              Voir tout <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Aucune mission pour le moment</p>
        ) : (
          <div className="space-y-3">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="p-4 border border-slate-100 rounded-xl hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{mission.titre}</h3>
                    <p className="text-sm text-slate-600">{mission.entreprise}</p>
                  </div>
                  <Badge className={`${statusConfig[mission.statut].className} border`}>
                    {statusConfig[mission.statut].label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  {mission.lieu && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mission.lieu}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(mission.date_debut), "d MMM yyyy", { locale: fr })}
                  </div>
                  <div className="font-semibold text-blue-600">
                    {mission.taux_horaire}€/h
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}