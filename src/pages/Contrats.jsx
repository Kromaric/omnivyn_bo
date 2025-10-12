import React, { useState, useEffect } from "react";
import { Mission } from "@/api/entities";
import { Interimaire } from "@/api/entities";
import { Entreprise } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  User,
  Briefcase,
  Building2,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STATUT_CONFIG = {
  genere: { label: "Généré", className: "bg-blue-100 text-blue-700 border-blue-200", icon: FileText },
  envoye: { label: "Envoyé", className: "bg-orange-100 text-orange-700 border-orange-200", icon: Send },
  signe: { label: "Signé", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  refuse: { label: "Refusé", className: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle }
};

export default function Contrats() {
  const [contrats, setContrats] = useState([]);
  const [interimaires, setInterimaires] = useState([]);
  const [missions, setMissions] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contratEntityExists, setContratEntityExists] = useState(false);
  const [filters, setFilters] = useState({
    statut: "all",
    recherche: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [interimairesData, missionsData, entreprisesData] = await Promise.all([
        Interimaire.list(),
        Mission.list(),
        Entreprise.list()
      ]);
      setInterimaires(interimairesData);
      setMissions(missionsData);
      setEntreprises(entreprisesData);

      // Essayer de charger les contrats
      try {
        const { Contrat } = await import("@/api/entities");
        const contratsData = await Contrat.list("-created_date");
        setContrats(contratsData);
        setContratEntityExists(true);
      } catch (error) {
        console.log("L'entité Contrat n'existe pas encore");
        setContrats([]);
        setContratEntityExists(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des contrats:", error);
      setContrats([]);
    }
    setLoading(false);
  };

  const handleUpdateStatut = async (contratId, newStatut) => {
    if (window.confirm(`Confirmez-vous le changement de statut du contrat en "${STATUT_CONFIG[newStatut].label}" ?`)) {
      try {
        const { Contrat } = await import("@/api/entities");
        await Contrat.update(contratId, { statut: newStatut });
        loadData();
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        alert("Erreur lors de la mise à jour du statut");
      }
    }
  };

  const filteredContrats = contrats.filter(contrat => {
    const matchStatut = filters.statut === "all" || contrat.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      contrat.interimaire_nom?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      contrat.mission_titre?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      contrat.entreprise_nom?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  const statsContrats = {
    total: contrats.length,
    genere: contrats.filter(c => c.statut === "genere").length,
    envoye: contrats.filter(c => c.statut === "envoye").length,
    signe: contrats.filter(c => c.statut === "signe").length,
    refuse: contrats.filter(c => c.statut === "refuse").length
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Contrats de mission
            </h1>
            <p className="text-slate-600">
              Gérez les contrats générés pour vos missions et intérimaires
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="w-6 h-6" />
            <span className="font-semibold">{contrats.length} contrats</span>
          </div>
        </div>

        {!contratEntityExists && !loading ? (
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun contrat pour le moment</h3>
              <p className="text-slate-600 mb-4">
                Générez votre premier contrat depuis une mission avec un intérimaire assigné
              </p>
              <Link to={createPageUrl("Missions")}>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Aller aux missions
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Total</p>
                      <p className="text-2xl font-bold text-slate-900">{statsContrats.total}</p>
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
                      <p className="text-sm text-slate-600 font-medium">Signés</p>
                      <p className="text-2xl font-bold text-slate-900">{statsContrats.signe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Envoyés</p>
                      <p className="text-2xl font-bold text-slate-900">{statsContrats.envoye}</p>
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
                      <p className="text-sm text-slate-600 font-medium">Refusés</p>
                      <p className="text-2xl font-bold text-slate-900">{statsContrats.refuse}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Rechercher contrat, intérimaire, mission..."
                      value={filters.recherche}
                      onChange={(e) => setFilters({ ...filters, recherche: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <Select
                      value={filters.statut}
                      onValueChange={(value) => setFilters({ ...filters, statut: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Statut du contrat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="genere">Généré</SelectItem>
                        <SelectItem value="envoye">Envoyé</SelectItem>
                        <SelectItem value="signe">Signé</SelectItem>
                        <SelectItem value="refuse">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            ) : filteredContrats.length === 0 ? (
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">Aucun contrat trouvé</p>
                  <p className="text-slate-400 text-sm mt-2">Générez un contrat depuis une mission assignée à un intérimaire.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredContrats.map(contrat => {
                  const StatutIcon = STATUT_CONFIG[contrat.statut]?.icon || FileText;
                  return (
                    <Card key={contrat.id} className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-blue-50">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900">Contrat pour {contrat.mission_titre}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`${STATUT_CONFIG[contrat.statut]?.className} border flex items-center gap-1`}>
                                    <StatutIcon className="w-3 h-3" />
                                    {STATUT_CONFIG[contrat.statut]?.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {contrat.interimaire_nom}
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4" />
                                {contrat.entreprise_nom}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {contrat.created_at ? (
                                  `Créé le ${format(new Date(contrat.created_at), "d MMM yyyy", { locale: fr })}`
                                ) : (
                                  "Date non disponible"
                                )}
                              </div>
                            </div>
                            {contrat.notes && (
                              <p className="text-sm text-slate-500 mt-3">{contrat.notes}</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {contrat.url_document && (
                              <a href={contrat.url_document} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                  <Download className="w-4 h-4 mr-2" />
                                  Télécharger
                                </Button>
                              </a>
                            )}
                            <Select
                              value={contrat.statut}
                              onValueChange={(value) => handleUpdateStatut(contrat.id, value)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Changer statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="genere">Généré</SelectItem>
                                <SelectItem value="envoye">Envoyé</SelectItem>
                                <SelectItem value="signe">Signé</SelectItem>
                                <SelectItem value="refuse">Refusé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}