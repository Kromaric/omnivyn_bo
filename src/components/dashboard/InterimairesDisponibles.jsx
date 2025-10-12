import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function InterimairesDisponibles({ interimaires, loading }) {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-slate-900">
            Disponibles
          </CardTitle>
          <Link to={createPageUrl("Interimaires")}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : interimaires.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Aucun intérimaire disponible</p>
        ) : (
          <div className="space-y-3">
            {interimaires.map((interimaire) => (
              <div
                key={interimaire.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200"
              >
                {interimaire.photo_url ? (
                  <img 
                    src={interimaire.photo_url} 
                    alt={interimaire.nom_complet}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{interimaire.nom_complet}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {interimaire.note && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-current" />
                        {interimaire.note.toFixed(1)}
                      </div>
                    )}
                    {interimaire.experience_annees && (
                      <span className="text-xs text-slate-500">
                        {interimaire.experience_annees} ans d'exp.
                      </span>
                    )}
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