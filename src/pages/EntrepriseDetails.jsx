
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Entreprise, Mission, Paiement } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { createPageUrl } from "@/utils";

export default function EntrepriseDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const entrepriseId = searchParams.get("id");
  
  const [entreprise, setEntreprise] = useState(null);
  const [missions, setMissions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [entrepriseData, allMissions, allPaiements] = await Promise.all([
        Entreprise.get(entrepriseId),
        Mission.list(),
        Paiement.list()
      ]);
      
      if (entrepriseData) {
        const entr = entrepriseData;
        setEntreprise(entr);
        setMissions(allMissions.filter(m => m.entreprise_id == entr.id || m.entreprise === entr.nom));
        setPaiements(allPaiements.filter(p => p.entreprise_id == entr.id || p.entreprise_nom === entr.nom));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
    setLoading(false);
  }, [entrepriseId]); // entrepriseId is a dependency for loadData

  useEffect(() => {
    if (entrepriseId) {
      loadData();
    }
  }, [entrepriseId, loadData]); // loadData is now a stable function due to useCallback

  const getStats = () => {
    const totalDepenses = paiements
      .filter(p => p.statut === "paye")
      .reduce((sum, p) => sum + (p.montant || 0), 0);
    
    const missionsActives = missions.filter(m => m.statut === "en_cours").length;
    const missionsTotal = missions.length;
    
    const interimairesUniques = [...new Set(missions.map(m => m.interimaire_assigne).filter(Boolean))];

    return {
      totalDepenses,
      missionsActives,
      missionsTotal,
      interimairesUtilises: interimairesUniques.length
    };
  };

  const getDepensesParMois = () => {
    const moisData = {};
    paiements.forEach(p => {
      if (p.date_paiement && p.statut === "paye") {
        const mois = format(new Date(p.date_paiement), "MMM yyyy", { locale: fr });
        moisData[mois] = (moisData[mois] || 0) + (p.montant || 0);
      }
    });

    return Object.entries(moisData)
      .map(([mois, depenses]) => ({ mois, depenses }))
      .slice(-6);
  };

  const getTopInterimaires = () => {
    const interimaireCount = {};
    missions.forEach(m => {
      if (m.interimaire_assigne) {
        interimaireCount[m.interimaire_assigne] = (interimaireCount[m.interimaire_assigne] || 0) + 1;
      }
    });

    return Object.entries(interimaireCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nom, missions]) => ({ nom, missions }));
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!entreprise) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">Entreprise introuvable</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Entreprises"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* En-tête entreprise */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{entreprise.nom}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${
                        entreprise.statut === "actif" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      } border`}>
                        {entreprise.statut === "actif" ? "Actif" : "Inactif"}
                      </Badge>
                      {entreprise.secteur && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {entreprise.secteur}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{entreprise.contact_email}</span>
                  </div>
                  {entreprise.contact_telephone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{entreprise.contact_telephone}</span>
                    </div>
                  )}
                  {entreprise.adresse && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{entreprise.adresse}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Contact:</span> {entreprise.contact_nom}
                  </p>
                  {entreprise.siret && (
                    <p className="text-sm text-slate-700 mt-1">
                      <span className="font-semibold">SIRET:</span> {entreprise.siret}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Dépenses totales</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalDepenses.toLocaleString('fr-FR')}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Missions actives</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.missionsActives}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total missions</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.missionsTotal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Intérimaires utilisés</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.interimairesUtilises}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Dépenses par mois</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getDepensesParMois()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="mois" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="depenses" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b border-slate-100">
              <CardTitle>Top 5 Intérimaires</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTopInterimaires()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="nom" type="category" stroke="#64748b" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="missions" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Missions récentes */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Historique des missions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {missions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Aucune mission pour cette entreprise</p>
            ) : (
              <div className="space-y-3">
                {missions.map(mission => (
                  <div key={mission.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">{mission.titre}</h4>
                        {mission.interimaire_assigne && (
                          <p className="text-sm text-slate-600">Assigné à: {mission.interimaire_assigne}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {format(new Date(mission.date_debut), "d MMM yyyy", { locale: fr })}
                          {mission.date_fin && ` - ${format(new Date(mission.date_fin), "d MMM yyyy", { locale: fr })}`}
                        </p>
                        <p className="text-sm font-semibold text-purple-600 mt-1">{mission.taux_horaire}€/h</p>
                      </div>
                      <Badge className={`${
                        mission.statut === "ouverte" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        mission.statut === "en_cours" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        mission.statut === "terminee" ? "bg-slate-100 text-slate-700 border-slate-200" :
                        "bg-red-100 text-red-700 border-red-200"
                      } border`}>
                        {mission.statut === "ouverte" ? "Ouverte" :
                         mission.statut === "en_cours" ? "En cours" :
                         mission.statut === "terminee" ? "Terminée" : "Annulée"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
