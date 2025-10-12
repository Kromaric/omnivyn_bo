import React, { useState, useEffect } from "react";
import { Interimaire } from "@/api/entities";
import { Mission } from "@/api/entities";
import { Paiement } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FichePaieDocument from "../components/fichespaie/FichePaieDocument";

export default function FichesPaie() {
  const [interimaires, setInterimaires] = useState([]);
  const [missions, setMissions] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [selectedInterimaire, setSelectedInterimaire] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showFiche, setShowFiche] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [interimairesData, missionsData, paiementsData] = await Promise.all([
      Interimaire.list("-created_date"),
      Mission.list(),
      Paiement.list()
    ]);
    setInterimaires(interimairesData);
    setMissions(missionsData);
    setPaiements(paiementsData);
    setLoading(false);
  };

  // Récupérer les paiements pour un intérimaire sur un mois donné
  const getPaiementsForMonth = (interimaireId, month, year) => {
    return paiements.filter(paiement => {
      // Vérifier l'intérimaire
      if (paiement.interimaire_id !== interimaireId) return false;
      
      // Ne garder que les paiements validés ou payés
      if (paiement.statut !== "valide" && paiement.statut !== "paye") return false;
      
      // Vérifier le mois/année via la période
      if (paiement.periode_debut) {
        const paiementDate = new Date(paiement.periode_debut);
        
        // Vérifier si la date est valide
        if (isNaN(paiementDate.getTime())) {
          console.warn('Date invalide pour paiement:', paiement.id, paiement.periode_debut);
          return false;
        }
        
        const paiementMonth = paiementDate.getMonth() + 1;
        const paiementYear = paiementDate.getFullYear();
        
        return paiementMonth === parseInt(month) && paiementYear === parseInt(year);
      }
      
      return false;
    });
  };

  // Récupérer les missions liées aux paiements (pour affichage contextuel)
  const getMissionsForPaiements = (paiementsMonth) => {
    const missionIds = paiementsMonth.map(p => p.mission_id).filter(Boolean);
    const uniqueMissionIds = [...new Set(missionIds)];
    return missions.filter(m => uniqueMissionIds.includes(m.id));
  };

  const handleGenerateFiche = () => {
    if (selectedInterimaire) {
      setShowFiche(true);
    }
  };

  // Intérimaires qui ont des paiements ce mois-ci
  const interimairesAvecPaiements = interimaires.filter(interimaire => {
    const paiementsMonth = getPaiementsForMonth(interimaire.id, selectedMonth, selectedYear);
    return paiementsMonth.length > 0;
  });

  const months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Fiches de paie
            </h1>
            <p className="text-slate-600">
              Générez les fiches de paie mensuelles basées sur les paiements validés
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="w-6 h-6" />
            <span className="font-semibold">{interimairesAvecPaiements.length} fiches disponibles</span>
          </div>
        </div>

        {!showFiche ? (
          <>
            <Card className="border-0 shadow-lg shadow-slate-200/50">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Sélectionner la période
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="month">Mois</Label>
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(value) => {
                        setSelectedMonth(parseInt(value));
                        setSelectedInterimaire(null);
                        setShowFiche(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={month.value.toString()}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Année</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => {
                        setSelectedYear(parseInt(value));
                        setSelectedInterimaire(null);
                        setShowFiche(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interimaire">Intérimaire</Label>
                    <Select
                      value={selectedInterimaire}
                      onValueChange={setSelectedInterimaire}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un intérimaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {interimairesAvecPaiements.map(interimaire => (
                          <SelectItem key={interimaire.id} value={interimaire.id}>
                            {interimaire.nom_complet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedInterimaire && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleGenerateFiche}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Générer la fiche de paie
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="border-0 shadow-lg shadow-slate-200/50">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-48 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : interimairesAvecPaiements.length === 0 ? (
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-2">
                    Aucun paiement validé pour {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Créez et validez des paiements dans la section Paiements
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interimairesAvecPaiements.map(interimaire => {
                  const paiementsMonth = getPaiementsForMonth(interimaire.id, selectedMonth, selectedYear);
                  const missionsMonth = getMissionsForPaiements(paiementsMonth);
                  
                  const totalHeures = paiementsMonth.reduce((sum, p) => sum + (p.heures_travaillees || 0), 0);
                  const totalMontant = paiementsMonth.reduce((sum, p) => sum + (p.montant || 0), 0);

                  return (
                    <Card
                      key={interimaire.id}
                      className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => {
                        setSelectedInterimaire(interimaire.id);
                        handleGenerateFiche();
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{interimaire.nom_complet}</h3>
                            <p className="text-sm text-slate-500">{interimaire.email}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Paiements :</span>
                            <span className="font-semibold text-slate-900">{paiementsMonth.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Missions :</span>
                            <span className="font-semibold text-slate-900">{missionsMonth.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Heures :</span>
                            <span className="font-semibold text-slate-900">{totalHeures.toFixed(1)}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Montant :</span>
                            <span className="font-semibold text-blue-600">{totalMontant.toLocaleString('fr-FR')}€</span>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInterimaire(interimaire.id);
                            handleGenerateFiche();
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Générer la fiche
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <FichePaieDocument
            interimaire={interimaires.find(i => i.id === selectedInterimaire)}
            missions={getMissionsForPaiements(getPaiementsForMonth(selectedInterimaire, selectedMonth, selectedYear))}
            paiements={getPaiementsForMonth(selectedInterimaire, selectedMonth, selectedYear)}
            month={selectedMonth}
            year={selectedYear}
            onClose={() => setShowFiche(false)}
          />
        )}
      </div>
    </div>
  );
}