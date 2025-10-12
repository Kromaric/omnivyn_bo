import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Interimaire, Mission, Paiement, Document } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, MapPin, Award, Star, Briefcase, DollarSign, TrendingUp, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { createPageUrl } from "@/utils";
import DocumentsTab from "../components/interimaires/DocumentsTab";

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function InterimaireDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const interimaireId = searchParams.get("id");
  
  const [interimaire, setInterimaire] = useState(null);
  const [missions, setMissions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [interimaireData, allMissions, allPaiements, allDocuments] = await Promise.all([
        Interimaire.get(interimaireId),
        Mission.list(),
        Paiement.list(),
        Document.list()
      ]);
      
      if (interimaireData) {
        const inter = interimaireData;
        setInterimaire(inter);
        setMissions(allMissions.filter(m => m.interimaire_id == inter.id || m.interimaire_assigne === inter.nom_complet));
        setPaiements(allPaiements.filter(p => p.interimaire_id == inter.id));
        setDocuments(allDocuments.filter(d => d.interimaire_id == inter.id));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
    setLoading(false);
  }, [interimaireId]);

  useEffect(() => {
    if (interimaireId) {
      loadData();
    }
  }, [interimaireId, loadData]);

  const getStats = () => {
    const totalRevenu = paiements
      .filter(p => p.statut === "paye")
      .reduce((sum, p) => sum + (p.montant || 0), 0);
    
    const missionsTerminees = missions.filter(m => m.statut === "terminee").length;
    const missionsEnCours = missions.filter(m => m.statut === "en_cours").length;
    
    const heuresTravaillees = paiements.reduce((sum, p) => sum + (p.heures_travaillees || 0), 0);

    return {
      totalRevenu,
      missionsTerminees,
      missionsEnCours,
      heuresTravaillees,
      tauxMoyen: heuresTravaillees > 0 ? totalRevenu / heuresTravaillees : 0
    };
  };

  const getMissionsParStatut = () => {
    const statuts = missions.reduce((acc, m) => {
      acc[m.statut] = (acc[m.statut] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statuts).map(([name, value]) => ({
      name: name === "ouverte" ? "Ouvertes" : name === "en_cours" ? "En cours" : name === "terminee" ? "Terminées" : "Annulées",
      value
    }));
  };

  const getRevenuParMois = () => {
    const moisData = {};
    paiements.forEach(p => {
      if (p.date_paiement && p.statut === "paye") {
        const mois = format(new Date(p.date_paiement), "MMM yyyy", { locale: fr });
        moisData[mois] = (moisData[mois] || 0) + (p.montant || 0);
      }
    });

    return Object.entries(moisData)
      .map(([mois, revenu]) => ({ mois, revenu }))
      .slice(-6);
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

  if (!interimaire) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">Intérimaire introuvable</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Interimaires"))}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {/* En-tête profil */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl text-white text-3xl font-bold">
                {interimaire.nom_complet[0]}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{interimaire.nom_complet}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${
                        interimaire.statut === "disponible" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        interimaire.statut === "en_mission" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      } border`}>
                        {interimaire.statut === "disponible" ? "Disponible" : 
                         interimaire.statut === "en_mission" ? "En mission" : "Indisponible"}
                      </Badge>
                      {interimaire.note && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {interimaire.note.toFixed(1)}/5
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{interimaire.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{interimaire.telephone}</span>
                  </div>
                  {interimaire.adresse && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{interimaire.adresse}</span>
                    </div>
                  )}
                  {interimaire.experience_annees && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{interimaire.experience_annees} ans d'exp.</span>
                    </div>
                  )}
                </div>

                {interimaire.competences?.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {interimaire.competences.map((comp, index) => (
                        <Badge key={index} variant="outline" className="bg-slate-50">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Revenu total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalRevenu.toLocaleString('fr-FR')}€</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Missions terminées</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.missionsTerminees}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Taux moyen</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.tauxMoyen.toFixed(2)}€/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Heures totales</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.heuresTravaillees.toFixed(0)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="statistiques" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-1">
            <TabsTrigger value="statistiques" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Documents ({documents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistiques" className="space-y-6">
            {/* Graphiques */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Revenus par mois</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getRevenuParMois()}>
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
                      <Bar dataKey="revenu" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle>Missions par statut</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getMissionsParStatut()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getMissionsParStatut().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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
                  <p className="text-center text-slate-500 py-8">Aucune mission pour cet intérimaire</p>
                ) : (
                  <div className="space-y-3">
                    {missions.map(mission => (
                      <div key={mission.id} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-slate-900">{mission.titre}</h4>
                            <p className="text-sm text-slate-600">{mission.entreprise}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(new Date(mission.date_debut), "d MMM yyyy", { locale: fr })}
                              {mission.date_fin && ` - ${format(new Date(mission.date_fin), "d MMM yyyy", { locale: fr })}`}
                            </p>
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
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab 
              documents={documents} 
              interimaire={interimaire} 
              onRefresh={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}