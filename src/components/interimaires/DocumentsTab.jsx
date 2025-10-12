import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Document } from "@/api/entities";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DOCUMENT_TYPES = {
  certificat_travail: { label: "Certificat de travail", icon: FileText },
  attestation_travail: { label: "Attestation de travail", icon: FileText },
  justificatif_identite: { label: "Justificatif d'identité", icon: FileText },
  carte_vitale: { label: "Carte vitale", icon: FileText },
  justificatif_domicile: { label: "Justificatif de domicile", icon: FileText },
  cv: { label: "CV", icon: FileText },
  rib: { label: "RIB", icon: FileText },
  autre: { label: "Autre", icon: FileText }
};

const STATUT_CONFIG = {
  valide: { label: "Valide", className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  expire: { label: "Expiré", className: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
  a_renouveler: { label: "À renouveler", className: "bg-orange-100 text-orange-700 border-orange-200", icon: Clock }
};

export default function DocumentsTab({ documents, interimaire, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    type_document: "cv",
    date_validite: "",
    statut: "valide",
    notes: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    setUploading(true);

    try {
      // Upload du fichier directement via l'API Laravel
      await Document.upload(selectedFile, {
        nom: selectedFile.name,
        type: formData.type_document,
        interimaire_id: interimaire.id,
        date_validite: formData.date_validite || null,
        statut: formData.statut,
        notes: formData.notes || null,
        documentable_type: 'App\\Models\\Interimaire',
        documentable_id: interimaire.id
      });

      // Reset
      setShowForm(false);
      setSelectedFile(null);
      setFormData({
        type_document: "cv",
        date_validite: "",
        statut: "valide",
        notes: ""
      });

      alert("Document uploadé avec succès !");
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload du document. Vérifiez la console pour plus de détails.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      await Document.delete(documentId);
      onRefresh();
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.type_document]) {
      acc[doc.type_document] = [];
    }
    acc[doc.type_document].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Documents administratifs</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un document
        </Button>
      </div>

      {showForm && (
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Nouveau document</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_document">Type de document *</Label>
                  <Select
                    value={formData.type_document}
                    onValueChange={(value) => setFormData({ ...formData, type_document: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOCUMENT_TYPES).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_validite">Date de validité</Label>
                  <Input
                    id="date_validite"
                    type="date"
                    value={formData.date_validite}
                    onChange={(e) => setFormData({ ...formData, date_validite: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-slate-600">Fichier sélectionné: {selectedFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={uploading}>
                  Annuler
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Uploader
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des documents par catégorie */}
      {Object.keys(DOCUMENT_TYPES).map(typeKey => {
        const docsOfType = groupedDocuments[typeKey] || [];
        const TypeIcon = DOCUMENT_TYPES[typeKey].icon;

        return (
          <Card key={typeKey} className="border-0 shadow-lg shadow-slate-200/50">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <TypeIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{DOCUMENT_TYPES[typeKey].label}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {docsOfType.length} document{docsOfType.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {docsOfType.length === 0 ? (
                <p className="text-center text-slate-400 py-4">Aucun document</p>
              ) : (
                <div className="space-y-3">
                  {docsOfType.map(doc => {
                    const StatutIcon = STATUT_CONFIG[doc.statut]?.icon || FileText;
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{doc.nom_fichier}</h4>
                            <Badge className={`${STATUT_CONFIG[doc.statut]?.className} border flex items-center gap-1`}>
                              <StatutIcon className="w-3 h-3" />
                              {STATUT_CONFIG[doc.statut]?.label}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Uploadé le {format(new Date(doc.date_upload), "d MMM yyyy", { locale: fr })}
                            </div>
                            {doc.date_validite && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Valide jusqu'au {format(new Date(doc.date_validite), "d MMM yyyy", { locale: fr })}
                              </div>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="text-sm text-slate-500 mt-2">{doc.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}