import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Building2, Briefcase, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  en_attente: { label: "En attente", className: "bg-orange-100 text-orange-700 border-orange-200" },
  valide: { label: "Validé", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paye: { label: "Payé", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  annule: { label: "Annulé", className: "bg-red-100 text-red-700 border-red-200" }
};

export default function PaiementsList({ paiements, loading, onEdit, onDelete }) {
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

  if (paiements.length === 0) {
    return (
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-12 text-center">
          <p className="text-slate-500 text-lg">Aucun paiement trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence>
        {paiements.map((paiement) => (
          <motion.div
            key={paiement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-blue-600">
                        {paiement.montant?.toLocaleString('fr-FR')}€
                      </h3>
                      <Badge className={`${statusConfig[paiement.statut].className} border`}>
                        {statusConfig[paiement.statut].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(paiement)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(paiement.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paiement.interimaire_nom && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{paiement.interimaire_nom}</span>
                    </div>
                  )}
                  {paiement.entreprise_nom && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>{paiement.entreprise_nom}</span>
                    </div>
                  )}
                  {paiement.mission_titre && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>{paiement.mission_titre}</span>
                    </div>
                  )}
                  {paiement.date_paiement && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{format(new Date(paiement.date_paiement), "d MMM yyyy", { locale: fr })}</span>
                    </div>
                  )}
                </div>

                {paiement.heures_travaillees && paiement.taux_horaire && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      {paiement.heures_travaillees}h × {paiement.taux_horaire}€/h
                      {paiement.periode_debut && paiement.periode_fin && (
                        <span className="ml-2">
                          ({format(new Date(paiement.periode_debut), "d MMM", { locale: fr })} - {format(new Date(paiement.periode_fin), "d MMM", { locale: fr })})
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {paiement.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-600 italic">{paiement.notes}</p>
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