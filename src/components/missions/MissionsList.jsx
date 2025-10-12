import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, DollarSign, Pencil, Trash2, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  ouverte: { label: "Ouverte", className: "bg-blue-100 text-blue-700 border-blue-200" },
  en_cours: { label: "En cours", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  terminee: { label: "Terminée", className: "bg-slate-100 text-slate-700 border-slate-200" },
  annulee: { label: "Annulée", className: "bg-red-100 text-red-700 border-red-200" }
};

export default function MissionsList({ missions, loading, onEdit, onDelete, onGenerateContrat, contrats }) {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-12 text-center">
          <p className="text-slate-500 text-lg">Aucune mission trouvée</p>
        </CardContent>
      </Card>
    );
  }

  const hasContrat = (missionId) => {
    return contrats?.some(c => c.mission_id === missionId);
  };

  return (
    <div className="grid gap-4">
      <AnimatePresence>
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{mission.titre}</h3>
                      <Badge className={`${statusConfig[mission.statut].className} border`}>
                        {statusConfig[mission.statut].label}
                      </Badge>
                      {hasContrat(mission.id) && (
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 border">
                          <FileText className="w-3 h-3 mr-1" />
                          Contrat généré
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium mb-3">{mission.entreprise}</p>
                    {mission.description && (
                      <p className="text-slate-600 text-sm mb-4">{mission.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {mission.interimaire_id && !hasContrat(mission.id) && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onGenerateContrat(mission)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        title="Générer un contrat"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(mission)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(mission.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{format(new Date(mission.date_debut), "d MMM yyyy", { locale: fr })}</span>
                  </div>
                  {mission.lieu && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{mission.lieu}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{mission.taux_horaire}€/h</span>
                  </div>
                  {mission.interimaire_assigne && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>{mission.interimaire_assigne}</span>
                    </div>
                  )}
                </div>

                {(mission.heures_totales || mission.jours_travailles || mission.heures_par_jour) && (
                  <div className="flex flex-wrap gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                    {mission.jours_travailles && (
                      <div className="text-sm">
                        <span className="text-slate-600">Durée:</span>
                        <span className="font-semibold text-slate-900 ml-2">
                          {mission.jours_travailles} jour{mission.jours_travailles > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {mission.heures_par_jour && (
                      <div className="text-sm">
                        <span className="text-slate-600">Heures/jour:</span>
                        <span className="font-semibold text-slate-900 ml-2">
                          {mission.heures_par_jour}h
                        </span>
                      </div>
                    )}
                    {mission.heures_totales && (
                      <div className="text-sm">
                        <span className="text-slate-600">Total heures:</span>
                        <span className="font-semibold text-blue-600 ml-2">
                          {mission.heures_totales}h
                        </span>
                      </div>
                    )}
                    {mission.heures_totales && mission.taux_horaire && (
                      <div className="text-sm">
                        <span className="text-slate-600">Coût estimé:</span>
                        <span className="font-semibold text-emerald-600 ml-2">
                          {(mission.heures_totales * mission.taux_horaire).toFixed(2)}€
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {mission.competences_requises?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mission.competences_requises.map((comp, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}