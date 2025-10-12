import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function InterimaireForm({ interimaire, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(interimaire || {
    nom_complet: "",
    email: "",
    telephone: "",
    date_naissance: "",
    adresse: "",
    competences: [],
    experience_annees: "",
    disponibilite: "immediat",
    statut: "disponible",
    taux_horaire_souhaite: "",
    note: ""
  });

  const [newCompetence, setNewCompetence] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCompetence = () => {
    if (newCompetence.trim()) {
      setFormData(prev => ({
        ...prev,
        competences: [...(prev.competences || []), newCompetence.trim()]
      }));
      setNewCompetence("");
    }
  };

  const removeCompetence = (index) => {
    setFormData(prev => ({
      ...prev,
      competences: prev.competences.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données avant l'envoi - convertir les chaînes vides en undefined pour les champs numériques
    const cleanedData = {
      ...formData,
      experience_annees: formData.experience_annees === "" ? undefined : formData.experience_annees,
      taux_horaire_souhaite: formData.taux_horaire_souhaite === "" ? undefined : formData.taux_horaire_souhaite,
      note: formData.note === "" ? undefined : formData.note,
      date_naissance: formData.date_naissance === "" ? undefined : formData.date_naissance
    };
    
    onSubmit(cleanedData);
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-900">
          {interimaire ? "Modifier l'intérimaire" : "Nouvel intérimaire"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom_complet">Nom complet *</Label>
              <Input
                id="nom_complet"
                value={formData.nom_complet}
                onChange={(e) => handleChange("nom_complet", e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="jean.dupont@email.com"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                placeholder="06 12 34 56 78"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => handleChange("date_naissance", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
              placeholder="Adresse complète"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="experience_annees">Années d'expérience</Label>
              <Input
                id="experience_annees"
                type="number"
                step="0.5"
                min="0"
                value={formData.experience_annees}
                onChange={(e) => handleChange("experience_annees", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taux_horaire_souhaite">Taux horaire souhaité (€)</Label>
              <Input
                id="taux_horaire_souhaite"
                type="number"
                step="0.01"
                min="0"
                value={formData.taux_horaire_souhaite}
                onChange={(e) => handleChange("taux_horaire_souhaite", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="15.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (sur 5)</Label>
              <Input
                id="note"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value ? parseFloat(e.target.value) : "")}
                placeholder="4.5"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="disponibilite">Disponibilité</Label>
              <Select
                value={formData.disponibilite}
                onValueChange={(value) => handleChange("disponibilite", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediat">Immédiat</SelectItem>
                  <SelectItem value="une_semaine">Une semaine</SelectItem>
                  <SelectItem value="deux_semaines">Deux semaines</SelectItem>
                  <SelectItem value="un_mois">Un mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(value) => handleChange("statut", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en_mission">En mission</SelectItem>
                  <SelectItem value="indisponible">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Compétences</Label>
            <div className="flex gap-2">
              <Input
                value={newCompetence}
                onChange={(e) => setNewCompetence(e.target.value)}
                placeholder="Ajouter une compétence"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCompetence())}
              />
              <Button type="button" onClick={addCompetence} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.competences?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.competences.map((comp, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {comp}
                    <button
                      type="button"
                      onClick={() => removeCompetence(index)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
            <Save className="w-4 h-4 mr-2" />
            {interimaire ? "Mettre à jour" : "Ajouter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}