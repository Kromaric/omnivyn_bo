import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function EntrepriseForm({ entreprise, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(entreprise || {
    nom: "",
    secteur: "",
    adresse: "",
    contact_nom: "",
    contact_email: "",
    contact_telephone: "",
    siret: "",
    statut: "actif"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Nettoyer les données - enlever les champs vides et nombre_missions
    const cleanedData = {
      nom: formData.nom,
      secteur: formData.secteur || undefined,
      adresse: formData.adresse || undefined,
      contact_nom: formData.contact_nom,
      contact_email: formData.contact_email,
      contact_telephone: formData.contact_telephone || undefined,
      siret: formData.siret || undefined,
      statut: formData.statut
    };
    
    onSubmit(cleanedData);
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-900">
          {entreprise ? "Modifier l'entreprise" : "Nouvelle entreprise"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'entreprise *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                placeholder="ACME Corporation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secteur">Secteur d'activité</Label>
              <Input
                id="secteur"
                value={formData.secteur}
                onChange={(e) => handleChange("secteur", e.target.value)}
                placeholder="Industrie, BTP, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse du siège</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleChange("adresse", e.target.value)}
              placeholder="Adresse complète"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Input
                id="siret"
                value={formData.siret}
                onChange={(e) => handleChange("siret", e.target.value)}
                placeholder="123 456 789 00012"
              />
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
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact principal</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contact_nom">Nom du contact *</Label>
                <Input
                  id="contact_nom"
                  value={formData.contact_nom}
                  onChange={(e) => handleChange("contact_nom", e.target.value)}
                  placeholder="Marie Martin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="contact@entreprise.fr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_telephone">Téléphone</Label>
                <Input
                  id="contact_telephone"
                  value={formData.contact_telephone}
                  onChange={(e) => handleChange("contact_telephone", e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            <Save className="w-4 h-4 mr-2" />
            {entreprise ? "Mettre à jour" : "Ajouter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}