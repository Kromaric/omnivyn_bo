import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function PaiementForm({ paiement, missions, interimaires, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(paiement || {
    mission_id: "",
    mission_titre: "",
    interimaire_nom: "",
    interimaire_id: "",
    entreprise_nom: "",
    entreprise_id: "",
    montant: "",
    date_paiement: "",
    statut: "en_attente",
    periode_debut: "",
    periode_fin: "",
    heures_travaillees: "",
    taux_horaire: "",
    notes: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMissionSelect = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      // Auto-remplir les données depuis la mission
      const interimaire = interimaires.find(i => i.id === mission.interimaire_id);
      
      setFormData(prev => ({
        ...prev,
        mission_id: mission.id,
        mission_titre: mission.titre,
        entreprise_nom: mission.entreprise,
        entreprise_id: mission.entreprise_id,
        interimaire_nom: mission.interimaire_assigne || interimaire?.nom_complet || prev.interimaire_nom,
        interimaire_id: mission.interimaire_id || prev.interimaire_id,
        taux_horaire: mission.taux_horaire || prev.taux_horaire,
        heures_travaillees: mission.heures_totales || prev.heures_travaillees,
        periode_debut: mission.date_debut || prev.periode_debut,
        periode_fin: mission.date_fin || prev.periode_fin,
        montant: mission.heures_totales && mission.taux_horaire 
          ? (mission.heures_totales * mission.taux_horaire) 
          : prev.montant
      }));
    }
  };

  const handleInterimaireSelect = (interimaireId) => {
    const interimaire = interimaires.find(i => i.id === interimaireId);
    if (interimaire) {
      setFormData(prev => ({
        ...prev,
        interimaire_id: interimaire.id,
        interimaire_nom: interimaire.nom_complet
      }));
    }
  };

  const calculateMontant = () => {
    if (formData.heures_travaillees && formData.taux_horaire) {
      const montant = parseFloat(formData.heures_travaillees) * parseFloat(formData.taux_horaire);
      setFormData(prev => ({ ...prev, montant }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données
    const cleanedData = {
      ...formData,
      montant: formData.montant || undefined,
      heures_travaillees: formData.heures_travaillees || undefined,
      taux_horaire: formData.taux_horaire || undefined,
      date_paiement: formData.date_paiement || undefined,
      periode_debut: formData.periode_debut || undefined,
      periode_fin: formData.periode_fin || undefined
    };
    
    onSubmit(cleanedData);
  };

  // Filtrer les missions qui ont un intérimaire assigné
  const missionsAvecInterimaire = missions.filter(m => 
    m.interimaire_id && (m.statut === "en_cours" || m.statut === "terminee")
  );

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-900">
          {paiement ? "Modifier le paiement" : "Nouveau paiement"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mission">Mission associée *</Label>
            <Select
              value={formData.mission_id}
              onValueChange={handleMissionSelect}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une mission" />
              </SelectTrigger>
              <SelectContent>
                {missionsAvecInterimaire.map(mission => (
                  <SelectItem key={mission.id} value={mission.id}>
                    {mission.titre} - {mission.entreprise} - {mission.interimaire_assigne}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Les informations seront automatiquement remplies depuis la mission
            </p>
          </div>

          {formData.mission_id && (
            <>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">Intérimaire:</span>
                    <p className="text-slate-900">{formData.interimaire_nom}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Entreprise:</span>
                    <p className="text-slate-900">{formData.entreprise_nom}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Taux horaire:</span>
                    <p className="text-slate-900">{formData.taux_horaire}€/h</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Heures:</span>
                    <p className="text-slate-900">{formData.heures_travaillees}h</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="periode_debut">Début période</Label>
                  <Input
                    id="periode_debut"
                    type="date"
                    value={formData.periode_debut}
                    onChange={(e) => handleChange("periode_debut", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periode_fin">Fin période</Label>
                  <Input
                    id="periode_fin"
                    type="date"
                    value={formData.periode_fin}
                    onChange={(e) => handleChange("periode_fin", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heures_travaillees">Heures travaillées</Label>
                  <Input
                    id="heures_travaillees"
                    type="number"
                    step="0.5"
                    value={formData.heures_travaillees}
                    onChange={(e) => handleChange("heures_travaillees", parseFloat(e.target.value))}
                    onBlur={calculateMontant}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taux_horaire">Taux horaire (€)</Label>
                  <Input
                    id="taux_horaire"
                    type="number"
                    step="0.01"
                    value={formData.taux_horaire}
                    onChange={(e) => handleChange("taux_horaire", parseFloat(e.target.value))}
                    onBlur={calculateMontant}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montant">Montant total (€) *</Label>
                  <Input
                    id="montant"
                    type="number"
                    step="0.01"
                    value={formData.montant}
                    onChange={(e) => handleChange("montant", parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date_paiement">Date de paiement</Label>
                  <Input
                    id="date_paiement"
                    type="date"
                    value={formData.date_paiement}
                    onChange={(e) => handleChange("date_paiement", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut *</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={(value) => handleChange("statut", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="paye">Payé</SelectItem>
                      <SelectItem value="annule">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Notes additionnelles..."
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Save className="w-4 h-4 mr-2" />
            {paiement ? "Mettre à jour" : "Créer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}