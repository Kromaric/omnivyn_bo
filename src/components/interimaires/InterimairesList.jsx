import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, Star, Pencil, Trash2, User, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  disponible: { label: "Disponible", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  en_mission: { label: "En mission", className: "bg-blue-100 text-blue-700 border-blue-200" },
  indisponible: { label: "Indisponible", className: "bg-slate-100 text-slate-700 border-slate-200" }
};

export default function InterimairesList({ interimaires, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
            <CardContent className="p-6">
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (interimaires.length === 0) {
    return (
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-12 text-center">
          <p className="text-slate-500 text-lg">Aucun intérimaire trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {interimaires.map((interimaire) => (
          <motion.div
            key={interimaire.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Link to={`${createPageUrl("InterimaireDetails")}?id=${interimaire.id}`}>
              <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {interimaire.photo_url ? (
                        <img 
                          src={interimaire.photo_url} 
                          alt={interimaire.nom_complet}
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900">{interimaire.nom_complet}</h3>
                        <Badge className={`${statusConfig[interimaire.statut]?.className || ''} border mt-1`}>
                          {statusConfig[interimaire.statut]?.label || interimaire.statut}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit(interimaire);
                        }}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(interimaire.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="truncate">{interimaire.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{interimaire.telephone}</span>
                    </div>
                    {interimaire.experience_annees && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span>{interimaire.experience_annees} ans d'expérience</span>
                      </div>
                    )}
                    {interimaire.note && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="font-semibold text-amber-600">{interimaire.note.toFixed(1)}/5</span>
                      </div>
                    )}
                    {interimaire.taux_horaire_souhaite && (
                      <div className="text-sm font-semibold text-blue-600">
                        {interimaire.taux_horaire_souhaite}€/h souhaité
                      </div>
                    )}
                  </div>

                  {interimaire.competences?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {interimaire.competences.slice(0, 3).map((comp, index) => (
                        <Badge key={index} variant="outline" className="bg-slate-50 text-xs">
                          {comp}
                        </Badge>
                      ))}
                      {interimaire.competences.length > 3 && (
                        <Badge variant="outline" className="bg-slate-50 text-xs">
                          +{interimaire.competences.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}