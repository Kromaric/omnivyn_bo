import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function FichePaieDocument({ interimaire, missions, paiements, month, year, onClose }) {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const monthName = months[month - 1];

  // Calculs basés sur les PAIEMENTS (et non les missions)
  const totalHeures = paiements.reduce((sum, p) => sum + (p.heures_travaillees || 0), 0);
  const salaireBrut = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  
  // Cotisations sociales (estimations)
  const cotisationsSalariales = salaireBrut * 0.22; // ~22% du brut
  const cotisationsPatronales = salaireBrut * 0.42; // ~42% du brut
  const salaireNet = salaireBrut - cotisationsSalariales;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-2xl max-w-4xl mx-auto bg-white print:shadow-none">
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
              <h2 className="text-2xl font-bold text-blue-600">FICHE DE PAIE</h2>
              <p className="text-lg text-slate-700 mt-2">{monthName} {year}</p>
              <p className="text-sm text-slate-500 mt-1">N° {year}{month.toString().padStart(2, '0')}{String(interimaire?.id || '0000').padStart(4, '0').slice(-4)}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Informations salarié */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
                SALARIÉ
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-slate-900">{interimaire?.nom_complet}</p>
                <p className="text-slate-600">{interimaire?.adresse}</p>
                <p className="text-slate-600">{interimaire?.email}</p>
                <p className="text-slate-600">{interimaire?.telephone}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
                PÉRIODE
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-slate-600">
                  <span className="font-semibold">Mois :</span> {monthName} {year}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Paiements :</span> {paiements.length}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Missions :</span> {missions.length}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold">Total heures :</span> {totalHeures.toFixed(2)}h
                </p>
              </div>
            </div>
          </div>

          {/* Détail des paiements */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
              DÉTAIL DES PAIEMENTS
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-3 font-semibold text-slate-700">Mission</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Entreprise</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Période</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Heures</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Taux (€/h)</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Montant (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((paiement, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="p-3 text-slate-900">{paiement.mission_titre || "Mission"}</td>
                      <td className="p-3 text-slate-600">{paiement.entreprise_nom || "-"}</td>
                      <td className="p-3 text-right text-slate-600">
                        {paiement.periode_debut && paiement.periode_fin ? (() => {
                          const dateDebut = new Date(paiement.periode_debut);
                          const dateFin = new Date(paiement.periode_fin);
                          return (!isNaN(dateDebut.getTime()) && !isNaN(dateFin.getTime())) ? (
                            <>
                              {format(dateDebut, "dd/MM", { locale: fr })} - 
                              {format(dateFin, "dd/MM", { locale: fr })}
                            </>
                          ) : "-";
                        })() : "-"}
                      </td>
                      <td className="p-3 text-right text-slate-900 font-semibold">
                        {paiement.heures_travaillees?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-3 text-right text-slate-900">
                        {paiement.taux_horaire?.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-3 text-right text-slate-900 font-semibold">
                        {paiement.montant?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td colSpan="3" className="p-3 text-right text-slate-900">TOTAL</td>
                    <td className="p-3 text-right text-slate-900">{totalHeures.toFixed(2)}</td>
                    <td className="p-3"></td>
                    <td className="p-3 text-right text-blue-600 text-lg">{salaireBrut.toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculs salaire */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 border-b-2 border-blue-200 pb-2">
              RÉMUNÉRATION
            </h3>
            <div className="bg-slate-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700">Salaire brut</span>
                <span className="font-semibold text-slate-900">{salaireBrut.toFixed(2)} €</span>
              </div>
              
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase">Cotisations salariales</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 pl-4">Sécurité sociale</span>
                  <span className="text-red-600">- {(cotisationsSalariales * 0.65).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 pl-4">Retraite</span>
                  <span className="text-red-600">- {(cotisationsSalariales * 0.25).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 pl-4">Chômage</span>
                  <span className="text-red-600">- {(cotisationsSalariales * 0.10).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2">
                  <span className="text-slate-700">Total cotisations salariales</span>
                  <span className="text-red-600">- {cotisationsSalariales.toFixed(2)} €</span>
                </div>
              </div>

              <div className="border-t-2 border-blue-600 pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">NET À PAYER</span>
                  <span className="text-2xl font-bold text-blue-600">{salaireNet.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cotisations patronales (information) */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-slate-600 mb-2">
              <span className="font-semibold">Note :</span> Les cotisations patronales ({cotisationsPatronales.toFixed(2)} €) 
              sont à la charge de l'employeur et n'apparaissent pas sur le salaire net.
            </p>
          </div>

          {/* Pied de page */}
          <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-200">
            <p>Document généré le {format(new Date(), "dd MMMM yyyy", { locale: fr })}</p>
            <p className="mt-1">omnivyn intérim - Tous droits réservés</p>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}