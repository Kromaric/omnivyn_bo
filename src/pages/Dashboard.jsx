import React, { useState, useEffect } from "react";
import { Mission, Interimaire, Entreprise } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsGrid from "../components/dashboard/StatsGrid";
import MissionsRecentes from "../components/dashboard/MissionsRecentes";
import InterimairesDisponibles from "../components/dashboard/InterimairesDisponibles";
import GraphiqueActivite from "../components/dashboard/GraphiqueActivite";

export default function Dashboard() {
  const [missions, setMissions] = useState([]);
  const [interimaires, setInterimaires] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [missionsData, interimairesData, entreprisesData] = await Promise.all([
      Mission.list("-created_date", 100),
      Interimaire.list("-created_date", 100),
      Entreprise.list("-created_date", 100)
    ]);
    setMissions(missionsData);
    setInterimaires(interimairesData);
    setEntreprises(entreprisesData);
    setLoading(false);
  };

  const stats = {
    missionsActives: missions.filter(m => m.statut === "en_cours").length,
    missionsOuvertes: missions.filter(m => m.statut === "ouverte").length,
    interimairesDisponibles: interimaires.filter(i => i.statut === "disponible").length,
    interimairesTotal: interimaires.length,
    entreprisesActives: entreprises.filter(e => e.statut === "actif").length,
    revenuMensuel: missions
      .filter(m => m.statut === "en_cours" || m.statut === "terminee")
      .reduce((sum, m) => {
        const jours = m.date_fin && m.date_debut 
          ? Math.ceil((new Date(m.date_fin) - new Date(m.date_debut)) / (1000 * 60 * 60 * 24))
          : 0;
        return sum + (m.taux_horaire || 0) * 7 * jours;
      }, 0)
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-slate-600">
              Vue d'ensemble de votre activité d'intérim
            </p>
          </div>
        </div>

        <StatsGrid stats={stats} loading={loading} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GraphiqueActivite missions={missions} loading={loading} />
            <MissionsRecentes missions={missions.slice(0, 5)} loading={loading} />
          </div>
          
          <div>
            <InterimairesDisponibles 
              interimaires={interimaires.filter(i => i.statut === "disponible").slice(0, 8)} 
              loading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}