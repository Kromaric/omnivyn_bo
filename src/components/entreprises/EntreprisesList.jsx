
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Mail, Phone, MapPin, Briefcase, Pencil, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusConfig = {
  actif: { label: "Actif", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactif: { label: "Inactif", className: "bg-slate-100 text-slate-700 border-slate-200" }
};

export default function EntreprisesList({ entreprises, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (entreprises.length === 0) {
    return (
      <Card className="border-0 shadow-lg shadow-slate-200/50">
        <CardContent className="p-12 text-center">
          <p className="text-slate-500 text-lg">Aucune entreprise trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <AnimatePresence>
        {entreprises.map((entreprise) => (
          <motion.div
            key={entreprise.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Link to={`${createPageUrl("EntrepriseDetails")}?id=${entreprise.id}`}>
              <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {entreprise.logo_url ? (
                        <img 
                          src={entreprise.logo_url} 
                          alt={entreprise.nom}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900">{entreprise.nom}</h3>
                        {entreprise.secteur && (
                          <p className="text-sm text-slate-600">{entreprise.secteur}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(entreprise);
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
                          onDelete(entreprise.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Badge className={`${statusConfig[entreprise.statut].className} border`}>
                      {statusConfig[entreprise.statut].label}
                    </Badge>
                    {entreprise.nombre_missions > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {entreprise.nombre_missions} missions
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900 mb-2">
                      Contact: {entreprise.contact_nom}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="truncate">{entreprise.contact_email}</span>
                    </div>
                    {entreprise.contact_telephone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span>{entreprise.contact_telephone}</span>
                      </div>
                    )}
                    {entreprise.adresse && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="truncate">{entreprise.adresse}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
