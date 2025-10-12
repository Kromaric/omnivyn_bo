import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TYPE_CONTRAT_LABELS = {
  journee: "À la journée",
  semaine: "À la semaine",
  mois: "Au mois",
  longue_duree: "Longue durée"
};

export default function MissionForm({ mission, entreprises, interimaires, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(mission || {
    titre: "",
    entreprise: "",
    entreprise_id: "",
    description: "",
    date_debut: "",
    date_fin: "",
    heures_par_jour: 7,
    jours_travailles: "",
    heures_totales: "",
    taux_horaire: "",
    statut: "ouverte",
    competences_requises: [],
    interimaire_assigne: "",
    interimaire_id: "",
    lieu: "",
    type_contrat: "journee"
  });

  const [newCompetence, setNewCompetence] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEntrepriseSelect = (entrepriseId) => {
    const entreprise = entreprises.find(e => e.id === entrepriseId);
    if (entreprise) {
      setFormData(prev => ({
        ...prev,
        entreprise_id: entreprise.id,
        entreprise: entreprise.nom
      }));
    }
  };

  const handleInterimaireSelect = (interimaireId) => {
    const interimaire = interimaires.find(i => i.id === interimaireId);
    if (interimaire) {
      setFormData(prev => ({
        ...prev,
        interimaire_id: interimaire.id,
        interimaire_assigne: interimaire.nom_complet,
        taux_horaire: interimaire.taux_horaire_souhaite || prev.taux_horaire
      }));
    } else if (interimaireId === "none") {
      setFormData(prev => ({
        ...prev,
        interimaire_id: "",
        interimaire_assigne: ""
      }));
    }
  };

  const calculateHeures = () => {
    if (formData.heures_par_jour && formData.jours_travailles) {
      const total = parseFloat(formData.heures_par_jour) * parseFloat(formData.jours_travailles);
      setFormData(prev => ({ ...prev, heures_totales: total }));
    } else if (formData.date_debut && formData.date_fin && formData.heures_par_jour) {
      const debut = new Date(formData.date_debut);
      const fin = new Date(formData.date_fin);
      const diffTime = Math.abs(fin.getTime() - debut.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const total = diffDays * parseFloat(formData.heures_par_jour);
      setFormData(prev => ({ 
        ...prev, 
        jours_travailles: diffDays,
        heures_totales: total 
      }));
    }
  };

  const addCompetence = () => {
    if (newCompetence.trim()) {
      setFormData(prev => ({
        ...prev,
        competences_requises: [...(prev.competences_requises || []), newCompetence.trim()]
      }));
      setNewCompetence("");
    }
  };

  const removeCompetence = (index) => {
    setFormData(prev => ({
      ...prev,
      competences_requises: prev.competences_requises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données - n'envoyer que les champs acceptés par le backend
    const cleanedData = {
      titre: formData.titre,
      entreprise_id: formData.entreprise_id,
      description: formData.description || undefined,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin || undefined,
      taux_horaire: formData.taux_horaire,
      statut: formData.statut,
      competences_requises: formData.competences_requises || undefined,
      interimaire_id: formData.interimaire_id || undefined,
      lieu: formData.lieu || undefined,
      type_contrat: formData.type_contrat || undefined
    };
    
    onSubmit(cleanedData);
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-900">
          {mission ? "Modifier la mission" : "Nouvelle mission"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre de la mission *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => handleChange("titre", e.target.value)}
                placeholder="Ex: Opérateur de production"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entreprise">Entreprise *</Label>
              <Select
                value={formData.entreprise_id}
                onValueChange={handleEntrepriseSelect}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {entreprises.map(entreprise => (
                    <SelectItem key={entreprise.id} value={entreprise.id}>
                      {entreprise.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Détails de la mission..."
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date_debut">Date de début *</Label>
              <Input
                id="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={(e) => {
                  handleChange("date_debut", e.target.value);
                  setTimeout(calculateHeures, 100);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_fin">Date de fin</Label>
              <Input
                id="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={(e) => {
                  handleChange("date_fin", e.target.value);
                  setTimeout(calculateHeures, 100);
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="heures_par_jour">Heures par jour</Label>
              <Input
                id="heures_par_jour"
                type="number"
                step="0.5"
                min="0"
                value={formData.heures_par_jour}
                onChange={(e) => {
                  handleChange("heures_par_jour", parseFloat(e.target.value) || "");
                  setTimeout(calculateHeures, 100);
                }}
                placeholder="7"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jours_travailles">Jours travaillés</Label>
              <Input
                id="jours_travailles"
                type="number"
                min="0"
                value={formData.jours_travailles}
                onChange={(e) => {
                  handleChange("jours_travailles", parseFloat(e.target.value) || "");
                  setTimeout(calculateHeures, 100);
                }}
                placeholder="Auto-calculé"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heures_totales">Heures totales</Label>
              <div className="relative">
                <Input
                  id="heures_totales"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.heures_totales}
                  onChange={(e) => handleChange("heures_totales", parseFloat(e.target.value) || "")}
                  placeholder="Auto-calculé"
                  className="pr-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={calculateHeures}
                  className="absolute right-1 top-1 h-8 text-xs"
                >
                  Calculer
                </Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taux_horaire">Taux horaire (€) *</Label>
              <Input
                id="taux_horaire"
                type="number"
                step="0.01"
                value={formData.taux_horaire}
                onChange={(e) => handleChange("taux_horaire", parseFloat(e.target.value) || "")}
                placeholder="15.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type_contrat">Type de contrat</Label>
              <Select
                value={formData.type_contrat}
                onValueChange={(value) => handleChange("type_contrat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_CONTRAT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
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
                  <SelectItem value="ouverte">Ouverte</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.heures_totales && formData.taux_horaire && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">
                Coût estimé de la mission: {(parseFloat(formData.heures_totales) * parseFloat(formData.taux_horaire)).toFixed(2)}€
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input
                id="lieu"
                value={formData.lieu}
                onChange={(e) => handleChange("lieu", e.target.value)}
                placeholder="Ville ou adresse"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interimaire">Intérimaire assigné</Label>
              <Select
                value={formData.interimaire_id || "none"}
                onValueChange={handleInterimaireSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un intérimaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun (non assigné)</SelectItem>
                  {interimaires.filter(i => i.statut === "disponible" || i.id === formData.interimaire_id).map(interimaire => (
                    <SelectItem key={interimaire.id} value={interimaire.id}>
                      {interimaire.nom_complet} {interimaire.taux_horaire_souhaite ? `(${interimaire.taux_horaire_souhaite}€/h)` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Compétences requises</Label>
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
            {formData.competences_requises?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.competences_requises.map((comp, index) => (
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
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Save className="w-4 h-4 mr-2" />
            {mission ? "Mettre à jour" : "Créer la mission"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}