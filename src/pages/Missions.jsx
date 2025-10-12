import React, { useState, useEffect } from "react";
import { Mission } from "@/api/entities";
import { Entreprise } from "@/api/entities";
import { Interimaire } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import MissionsList from "../components/missions/MissionsList";
import MissionForm from "../components/missions/MissionForm";
import MissionFilters from "../components/missions/MissionFilters";
import ContratDocument from "../components/contrats/ContratDocument";

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [interimaires, setInterimaires] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [generatingContrat, setGeneratingContrat] = useState(null);
  const [filters, setFilters] = useState({ statut: "all", recherche: "" });
  const [loading, setLoading] = useState(true);
  const [contratEntityExists, setContratEntityExists] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les entités de base
      const [missionsData, entreprisesData, interimairesData] = await Promise.all([
        Mission.list("-created_date"),
        Entreprise.list(),
        Interimaire.list()
      ]);
      setMissions(missionsData);
      setEntreprises(entreprisesData);
      setInterimaires(interimairesData);

      // Essayer de charger les contrats (peut ne pas exister encore)
      try {
        const { Contrat } = await import("@/api/entities");
        const contratsData = await Contrat.list();
        setContrats(contratsData);
        setContratEntityExists(true);
      } catch (error) {
        console.log("L'entité Contrat n'existe pas encore, elle sera créée lors du premier contrat");
        setContrats([]);
        setContratEntityExists(false);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (missionData) => {
    try {
      if (editingMission) {
        await Mission.update(editingMission.id, missionData);
      } else {
        await Mission.create(missionData);
      }
      setShowForm(false);
      setEditingMission(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Erreurs de validation:\n' + errorMessages);
      } else {
        alert('Erreur lors de la sauvegarde de la mission');
      }
    }
  };

  const handleEdit = (mission) => {
    setEditingMission(mission);
    setShowForm(true);
  };

  const handleDelete = async (missionId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
      await Mission.delete(missionId);
      loadData();
    }
  };

  const handleGenerateContrat = (mission) => {
    setGeneratingContrat(mission);
  };

  const handleSaveContrat = async (htmlContent, mission, interimaire) => {
    try {
      // Importer l'entité Contrat
      const { Contrat } = await import("@/api/entities");
      
      // Créer le contrat dans la base de données
      // Note: Pour l'instant, on stocke juste l'enregistrement sans uploader le fichier HTML
      // Vous pouvez ajouter l'upload plus tard si nécessaire
      const newContrat = await Contrat.create({
        mission_id: mission.id,
        interimaire_id: interimaire.id,
        entreprise_id: mission.entreprise_id,
        numero_contrat: `CNT-${Date.now()}`,
        date_debut: mission.date_debut,
        date_fin: mission.date_fin,
        statut: "brouillon",
        salaire: mission.taux_horaire,
        type: mission.type_contrat || "temporaire",
        conditions: `Contrat généré automatiquement pour la mission ${mission.titre}`,
        document_url: null // Pour l'instant pas d'upload de fichier
      });

      alert("Contrat généré avec succès !");
      setGeneratingContrat(null);
      loadData();
    } catch (error) {
      console.error("Erreur lors de la génération du contrat:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Erreurs de validation:\n' + errorMessages);
      } else {
        alert("Erreur lors de la génération du contrat: " + (error.message || 'Erreur inconnue'));
      }
    }
  };

  const filteredMissions = missions.filter(mission => {
    const matchStatut = filters.statut === "all" || mission.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      mission.titre?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      mission.entreprise?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  const getInterimaireForMission = (mission) => {
    return interimaires.find(i => i.id === mission.interimaire_id);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Missions
            </h1>
            <p className="text-slate-600">
              Gérez toutes les missions d'intérim
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingMission(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle mission
          </Button>
        </div>

        {showForm ? (
          <MissionForm
            mission={editingMission}
            entreprises={entreprises}
            interimaires={interimaires}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingMission(null);
            }}
          />
        ) : (
          <>
            <MissionFilters filters={filters} setFilters={setFilters} />
            <MissionsList
              missions={filteredMissions}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGenerateContrat={handleGenerateContrat}
              contrats={contrats}
            />
          </>
        )}

        {generatingContrat && (
          <ContratDocument
            mission={generatingContrat}
            interimaire={getInterimaireForMission(generatingContrat)}
            onClose={() => setGeneratingContrat(null)}
            onGenerate={handleSaveContrat}
          />
        )}
      </div>
    </div>
  );
}