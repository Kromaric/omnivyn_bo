import React, { useState, useEffect } from "react";
import { Paiement, Mission, Interimaire } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PaiementsList from "../components/paiements/PaiementsList";
import PaiementForm from "../components/paiements/PaiementForm";
import PaiementsFilters from "../components/paiements/PaiementsFilters";
import PaiementsStats from "../components/paiements/PaiementsStats";

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [missions, setMissions] = useState([]);
  const [interimaires, setInterimaires] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState(null);
  const [filters, setFilters] = useState({ statut: "all", recherche: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [paiementsData, missionsData, interimairesData] = await Promise.all([
      Paiement.list("-created_date"),
      Mission.list(),
      Interimaire.list()
    ]);
    setPaiements(paiementsData);
    setMissions(missionsData);
    setInterimaires(interimairesData);
    setLoading(false);
  };

  const handleSubmit = async (paiementData) => {
    if (editingPaiement) {
      await Paiement.update(editingPaiement.id, paiementData);
    } else {
      await Paiement.create(paiementData);
    }
    setShowForm(false);
    setEditingPaiement(null);
    loadData();
  };

  const handleEdit = (paiement) => {
    setEditingPaiement(paiement);
    setShowForm(true);
  };

  const handleDelete = async (paiementId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      await Paiement.delete(paiementId);
      loadData();
    }
  };

  const filteredPaiements = paiements.filter(paiement => {
    const matchStatut = filters.statut === "all" || paiement.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      paiement.interimaire_nom?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      paiement.entreprise_nom?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      paiement.mission_titre?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Paiements
            </h1>
            <p className="text-slate-600">
              Gestion des paiements et facturations
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingPaiement(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau paiement
          </Button>
        </div>

        {!showForm && <PaiementsStats paiements={paiements} loading={loading} />}

        {showForm ? (
          <PaiementForm
            paiement={editingPaiement}
            missions={missions}
            interimaires={interimaires}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPaiement(null);
            }}
          />
        ) : (
          <>
            <PaiementsFilters filters={filters} setFilters={setFilters} />
            <PaiementsList
              paiements={filteredPaiements}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
}