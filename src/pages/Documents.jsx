import React, { useState, useEffect } from "react";
import { Document, Interimaire } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  User
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const DOCUMENT_TYPES = {
  certificat_travail: "Certificat de travail",
  attestation_travail: "Attestation de travail",
  justificatif_identite: "Justificatif d'identité",
  carte_vitale: "Carte vitale",
  justificatif_domicile: "Justificatif de domicile",
  cv: "CV",
  rib: "RIB",
  autre: "Autre"
};

const STATUT_CONFIG = {
  valide: { label: "Valide", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  expire: { label: "Expiré", className: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
  a_renouveler: { label: "À renouveler", className: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock }
};

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [interimaires, setInterimaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all",
    statut: "all",
    recherche: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [docsData, interimairesData] = await Promise.all([
      Document.list("-created_date"),
      Interimaire.list()
    ]);
    setDocuments(docsData);
    setInterimaires(interimairesData);
    setLoading(false);
  };

  const getInterimaireNom = (interimaireId) => {
    const interimaire = interimaires.find(i => i.id === interimaireId);
    return interimaire ? interimaire.nom_complet : "Inconnu";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchType = filters.type === "all" || doc.type_document === filters.type;
    const matchStatut = filters.statut === "all" || doc.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      doc.nom_fichier?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      doc.interimaire_nom?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      getInterimaireNom(doc.interimaire_id)?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchType && matchStatut && matchRecherche;
  });

  const statsDocuments = {
    total: documents.length,
    valides: documents.filter(d => d.statut === "valide").length,
    expires: documents.filter(d => d.statut === "expire").length,
    aRenouveler: documents.filter(d => d.statut === "a_renouveler").length
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Documents
            </h1>
            <p className="text-slate-600">
              Tous les documents administratifs des intérimaires
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="w-6 h-6" />
            <span className="font-semibold">{documents.length} documents</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{statsDocuments.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Valides</p>
                  <p className="text-2xl font-bold text-slate-900">{statsDocuments.valides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">À renouveler</p>
                  <p className="text-2xl font-bold text-slate-900">{statsDocuments.aRenouveler}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Expirés</p>
                  <p className="text-2xl font-bold text-slate-900">{statsDocuments.expires}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={filters.recherche}
                  onChange={(e) => setFilters({ ...filters, recherche: e.target.value })}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-400" />
                <Select
                  value={filters.statut}
                  onValueChange={(value) => setFilters({ ...filters, statut: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="valide">Valide</SelectItem>
                    <SelectItem value="a_renouveler">À renouveler</SelectItem>
                    <SelectItem value="expire">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des documents */}
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucun document trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map(doc => {
              const StatutIcon = STATUT_CONFIG[doc.statut]?.icon || FileText;
              return (
                <Card key={doc.id} className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{doc.nom_fichier}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-slate-50">
                                {DOCUMENT_TYPES[doc.type_document] || doc.type_document}
                              </Badge>
                              <Badge className={`${STATUT_CONFIG[doc.statut]?.className} border flex items-center gap-1`}>
                                <StatutIcon className="w-3 h-3" />
                                {STATUT_CONFIG[doc.statut]?.label}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                          <Link 
                            to={`${createPageUrl("InterimaireDetails")}?id=${doc.interimaire_id}`}
                            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            {doc.interimaire_nom || getInterimaireNom(doc.interimaire_id)}
                          </Link>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {doc.date_upload ? (
                              `Uploadé le ${format(new Date(doc.date_upload), "d MMM yyyy", { locale: fr })}`
                            ) : (
                              "Date non disponible"
                            )}
                          </div>
                          {doc.date_validite && (() => {
                            const date = new Date(doc.date_validite);
                            return !isNaN(date.getTime()) ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Valide jusqu'au {format(date, "d MMM yyyy", { locale: fr })}
                              </div>
                            ) : null;
                          })()}
                        </div>

                        {doc.notes && (
                          <p className="text-sm text-slate-500 mt-3 p-3 bg-slate-50 rounded-lg">
                            {doc.notes}
                          </p>
                        )}
                      </div>

                      <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}