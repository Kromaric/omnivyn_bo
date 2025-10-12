import React, { useState, useEffect } from "react";
import { Interimaire } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import InterimairesList from "../components/interimaires/InterimairesList";
import InterimaireForm from "../components/interimaires/InterimaireForm";
import InterimairesFilters from "../components/interimaires/InterimairesFilters";

export default function Interimaires() {
  const [interimaires, setInterimaires] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInterimaire, setEditingInterimaire] = useState(null);
  const [filters, setFilters] = useState({ statut: "all", recherche: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterimaires();
  }, []);

  const loadInterimaires = async () => {
    setLoading(true);
    const data = await Interimaire.list("-created_date");
    setInterimaires(data);
    setLoading(false);
  };

  const handleSubmit = async (interimaireData) => {
    try {
      if (editingInterimaire) {
        await Interimaire.update(editingInterimaire.id, interimaireData);
      } else {
        await Interimaire.create(interimaireData);
      }
      setShowForm(false);
      setEditingInterimaire(null);
      loadInterimaires();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Erreurs de validation:\n' + errorMessages);
      } else {
        alert('Erreur lors de la sauvegarde de l\'intérimaire');
      }
    }
  };

  const handleEdit = (interimaire) => {
    setEditingInterimaire(interimaire);
    setShowForm(true);
  };

  const handleDelete = async (interimaireId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet intérimaire ?")) {
      await Interimaire.delete(interimaireId);
      loadInterimaires();
    }
  };

  const filteredInterimaires = interimaires.filter(interimaire => {
    const matchStatut = filters.statut === "all" || interimaire.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      interimaire.nom_complet?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      interimaire.email?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Intérimaires
            </h1>
            <p className="text-slate-600">
              Base de données des intérimaires
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingInterimaire(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un intérimaire
          </Button>
        </div>

        {showForm ? (
          <InterimaireForm
            interimaire={editingInterimaire}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingInterimaire(null);
            }}
          />
        ) : (
          <>
            <InterimairesFilters filters={filters} setFilters={setFilters} />
            <InterimairesList
              interimaires={filteredInterimaires}
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