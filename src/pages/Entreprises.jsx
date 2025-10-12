import React, { useState, useEffect } from "react";
import { Entreprise } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import EntreprisesList from "../components/entreprises/EntreprisesList";
import EntrepriseForm from "../components/entreprises/EntrepriseForm";
import EntreprisesFilters from "../components/entreprises/EntreprisesFilters";

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [filters, setFilters] = useState({ statut: "all", recherche: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntreprises();
  }, []);

  const loadEntreprises = async () => {
    setLoading(true);
    const data = await Entreprise.list("-created_date");
    setEntreprises(data);
    setLoading(false);
  };

  const handleSubmit = async (entrepriseData) => {
    try {
      if (editingEntreprise) {
        await Entreprise.update(editingEntreprise.id, entrepriseData);
      } else {
        await Entreprise.create(entrepriseData);
      }
      setShowForm(false);
      setEditingEntreprise(null);
      loadEntreprises();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Erreurs de validation:\n' + errorMessages);
      } else {
        alert('Erreur lors de la sauvegarde de l\'entreprise');
      }
    }
  };

  const handleEdit = (entreprise) => {
    setEditingEntreprise(entreprise);
    setShowForm(true);
  };

  const handleDelete = async (entrepriseId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      await Entreprise.delete(entrepriseId);
      loadEntreprises();
    }
  };

  const filteredEntreprises = entreprises.filter(entreprise => {
    const matchStatut = filters.statut === "all" || entreprise.statut === filters.statut;
    const matchRecherche = !filters.recherche || 
      entreprise.nom?.toLowerCase().includes(filters.recherche.toLowerCase()) ||
      entreprise.secteur?.toLowerCase().includes(filters.recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Entreprises clientes
            </h1>
            <p className="text-slate-600">
              Gestion de vos clients
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEntreprise(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter une entreprise
          </Button>
        </div>

        {showForm ? (
          <EntrepriseForm
            entreprise={editingEntreprise}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEntreprise(null);
            }}
          />
        ) : (
          <>
            <EntreprisesFilters filters={filters} setFilters={setFilters} />
            <EntreprisesList
              entreprises={filteredEntreprises}
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