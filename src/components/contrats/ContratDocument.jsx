import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Send, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ContratDocument({ mission, interimaire, onClose, onGenerate }) {
  const contractRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = contractRef.current.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      await onGenerate(blob, mission, interimaire, false); // false = ne pas envoyer par email
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      alert("Erreur lors de la génération du contrat");
    }
    setIsGenerating(false);
  };

  const handleGenerateAndSend = async () => {
    setIsSending(true);
    try {
      const htmlContent = contractRef.current.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      await onGenerate(blob, mission, interimaire, true); // true = envoyer par email
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi du contrat");
    }
    setIsSending(false);
  };

  if (!interimaire) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Aucun intérimaire assigné à cette mission</p>
            <Button onClick={onClose}>Fermer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleGenerate}
                disabled={isGenerating || isSending}
              >
                {isGenerating ? (
                  <>Génération...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Générer seulement
                  </>
                )}
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={handleGenerateAndSend}
                disabled={isGenerating || isSending}
              >
                {isSending ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Générer et envoyer à l'intérimaire
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white" ref={contractRef}>
            <CardHeader className="border-b-2 border-blue-600 bg-gradient-to-r from-blue-50 to-slate-50 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">omnivyn</h1>
                  <p className="text-sm text-slate-600">intérim</p>
                  <p className="text-sm text-slate-600 mt-2">123 Avenue de la République</p>
                  <p className="text-sm text-slate-600">75011 Paris</p>
                  <p className="text-sm text-slate-600">SIRET: 123 456 789 00012</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-blue-600">CONTRAT DE MISSION</h2>
                  <p className="text-lg text-slate-700 mt-2">N° {mission.id?.slice(-6)}</p>
                  <p className="text-sm text-slate-500 mt-1">Généré le {format(new Date(), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
                  ENTRE LES SOUSSIGNÉS
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">L'Agence d'Intérim :</p>
                    <p><strong>omnivyn intérim</strong></p>
                    <p>123 Avenue de la République</p>
                    <p>75011 Paris</p>
                    <p>Représentée par : Directeur de l'agence</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Le Salarié Intérimaire :</p>
                    <p><strong>{interimaire.nom_complet}</strong></p>
                    <p>{interimaire.adresse || 'Adresse non renseignée'}</p>
                    <p>Né(e) le {interimaire.date_naissance ? format(new Date(interimaire.date_naissance), "dd MMMM yyyy", { locale: fr }) : 'Non renseigné'}</p>
                    <p>Téléphone : {interimaire.telephone}</p>
                    <p>Email : {interimaire.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
                  OBJET DE LA MISSION
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-700">
                    L'Agence d'Intérim confie à l'intérimaire une mission auprès de l'entreprise utilisatrice :
                  </p>
                  <p><strong>Entreprise Utilisatrice :</strong> {mission.entreprise}</p>
                  <p><strong>Titre de la mission :</strong> {mission.titre}</p>
                  <p><strong>Lieu d'exécution :</strong> {mission.lieu || 'Non spécifié'}</p>
                  <p><strong>Description de la mission :</strong> {mission.description || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
                  DURÉE ET RÉMUNÉRATION
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Date de début de mission :</strong> {format(new Date(mission.date_debut), "dd MMMM yyyy", { locale: fr })}</p>
                  <p><strong>Date de fin de mission :</strong> {mission.date_fin ? format(new Date(mission.date_fin), "dd MMMM yyyy", { locale: fr }) : 'Indéterminée'}</p>
                  <p><strong>Heures par jour :</strong> {mission.heures_par_jour || 7}h</p>
                  <p><strong>Jours travaillés estimés :</strong> {mission.jours_travailles || 'À définir'}</p>
                  <p><strong>Total heures estimées :</strong> {mission.heures_totales || 'À définir'}h</p>
                  <p><strong>Taux horaire brut :</strong> {mission.taux_horaire}€/heure</p>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200">
                <p>Ce contrat est régi par les lois françaises et les conventions collectives applicables.</p>
                <p className="mt-1">omnivyn intérim - Tous droits réservés</p>
                <div className="mt-6 flex justify-around">
                  <div className="w-1/3 text-center">
                    <div className="border-t border-slate-300 pt-2 mt-8">
                      <p className="font-semibold">Signature de l'Agence</p>
                    </div>
                  </div>
                  <div className="w-1/3 text-center">
                    <div className="border-t border-slate-300 pt-2 mt-8">
                      <p className="font-semibold">Signature de l'Intérimaire</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}