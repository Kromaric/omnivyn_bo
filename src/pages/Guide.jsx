import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  CreditCard, 
  FileText,
  Building2,
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from "lucide-react";

const guides = [
  {
    categorie: "Démarrage",
    icon: BookOpen,
    color: "blue",
    articles: [
      {
        titre: "Premiers pas avec omnivyn intérim",
        description: "Découvrez comment configurer votre agence et ajouter vos premières données",
        etapes: [
          "Créez vos entreprises clientes",
          "Ajoutez vos intérimaires dans la base de données",
          "Créez votre première mission",
          "Assignez un intérimaire à la mission"
        ]
      },
      {
        titre: "Organisation de votre tableau de bord",
        description: "Personnalisez votre espace de travail pour une efficacité maximale",
        etapes: [
          "Consultez les statistiques en temps réel",
          "Suivez les missions actives",
          "Vérifiez les intérimaires disponibles",
          "Analysez vos revenus mensuels"
        ]
      }
    ]
  },
  {
    categorie: "Gestion des Intérimaires",
    icon: Users,
    color: "emerald",
    articles: [
      {
        titre: "Créer et gérer les profils",
        description: "Comment ajouter et maintenir à jour vos intérimaires",
        etapes: [
          "Cliquez sur 'Intérimaires' dans le menu",
          "Remplissez les informations (nom, email, téléphone, compétences)",
          "Ajoutez les documents administratifs dans l'onglet Documents",
          "Consultez les statistiques et l'historique des missions"
        ]
      },
      {
        titre: "Gestion des documents administratifs",
        description: "Centralisez tous les documents importants",
        etapes: [
          "Accédez au profil de l'intérimaire",
          "Cliquez sur l'onglet 'Documents'",
          "Uploadez les documents requis (CV, RIB, carte vitale, etc.)",
          "Définissez les dates de validité pour un suivi automatique"
        ]
      },
      {
        titre: "Suivre les performances",
        description: "Analysez l'activité de chaque intérimaire",
        etapes: [
          "Consultez les graphiques de revenus mensuels",
          "Vérifiez le nombre de missions effectuées",
          "Analysez le taux horaire moyen",
          "Suivez les heures travaillées totales"
        ]
      }
    ]
  },
  {
    categorie: "Gestion des Missions",
    icon: Briefcase,
    color: "purple",
    articles: [
      {
        titre: "Créer une nouvelle mission",
        description: "Processus complet de création d'une mission",
        etapes: [
          "Allez dans 'Missions' et cliquez sur 'Nouvelle mission'",
          "Renseignez le titre, l'entreprise et la description",
          "Définissez les dates de début et fin",
          "Indiquez le taux horaire et les compétences requises",
          "Assignez un intérimaire disponible"
        ]
      },
      {
        titre: "Suivi et gestion des statuts",
        description: "Gérez le cycle de vie de vos missions",
        etapes: [
          "Ouverte: mission nouvellement créée",
          "En cours: mission assignée et active",
          "Terminée: mission complétée avec succès",
          "Annulée: mission annulée par l'entreprise ou l'agence"
        ]
      },
      {
        titre: "Matching intérimaire-mission",
        description: "Trouvez le bon profil pour chaque mission",
        etapes: [
          "Analysez les compétences requises de la mission",
          "Consultez les intérimaires disponibles",
          "Vérifiez l'expérience et les notes",
          "Assignez l'intérimaire le plus adapté"
        ]
      }
    ]
  },
  {
    categorie: "Gestion des Entreprises",
    icon: Building2,
    color: "orange",
    articles: [
      {
        titre: "Ajouter une entreprise cliente",
        description: "Enregistrez vos clients et leurs informations",
        etapes: [
          "Accédez à 'Entreprises' et cliquez sur 'Ajouter'",
          "Renseignez le nom, secteur d'activité et SIRET",
          "Ajoutez les coordonnées du contact principal",
          "Définissez l'adresse et le statut (actif/inactif)"
        ]
      },
      {
        titre: "Analyser l'activité d'une entreprise",
        description: "Suivez les dépenses et missions par client",
        etapes: [
          "Cliquez sur une entreprise pour voir ses détails",
          "Consultez les dépenses totales et mensuelles",
          "Visualisez le nombre de missions actives",
          "Identifiez les intérimaires les plus utilisés"
        ]
      }
    ]
  },
  {
    categorie: "Gestion des Paiements",
    icon: CreditCard,
    color: "pink",
    articles: [
      {
        titre: "Créer un nouveau paiement",
        description: "Enregistrez les paiements des intérimaires",
        etapes: [
          "Allez dans 'Paiements' et créez un nouveau paiement",
          "Sélectionnez l'intérimaire et la mission concernée",
          "Renseignez les heures travaillées et le taux horaire",
          "Le montant sera calculé automatiquement",
          "Définissez le statut (en attente, validé, payé)"
        ]
      },
      {
        titre: "Suivi des statuts de paiement",
        description: "Gérez le workflow des paiements",
        etapes: [
          "En attente: paiement créé, en cours de validation",
          "Validé: paiement approuvé, prêt à être versé",
          "Payé: paiement effectué à l'intérimaire",
          "Annulé: paiement annulé (mission annulée, erreur, etc.)"
        ]
      }
    ]
  },
  {
    categorie: "Fiches de Paie",
    icon: FileText,
    color: "indigo",
    articles: [
      {
        titre: "Générer une fiche de paie",
        description: "Créez des fiches de paie professionnelles",
        etapes: [
          "Accédez à 'Fiches de paie'",
          "Sélectionnez le mois et l'année",
          "Choisissez l'intérimaire concerné",
          "Vérifiez les missions et paiements du mois",
          "Générez et téléchargez la fiche en PDF"
        ]
      },
      {
        titre: "Comprendre le calcul des cotisations",
        description: "Détails du calcul du salaire net",
        etapes: [
          "Salaire brut = heures travaillées × taux horaire",
          "Cotisations salariales ≈ 22% du brut",
          "Cotisations patronales ≈ 42% du brut (à charge de l'agence)",
          "Salaire net = salaire brut - cotisations salariales"
        ]
      }
    ]
  }
];

const conseils = [
  {
    titre: "Maintenez vos données à jour",
    description: "Actualisez régulièrement les statuts des intérimaires et des missions pour une gestion optimale.",
    icon: CheckCircle2,
    color: "emerald"
  },
  {
    titre: "Utilisez les filtres",
    description: "Les filtres de recherche vous permettent de trouver rapidement les informations dont vous avez besoin.",
    icon: Lightbulb,
    color: "amber"
  },
  {
    titre: "Gérez les documents administratifs",
    description: "Gardez tous les documents à jour avec des dates de validité pour éviter les problèmes légaux.",
    icon: FileText,
    color: "blue"
  },
  {
    titre: "Suivez vos statistiques",
    description: "Consultez régulièrement le tableau de bord pour optimiser votre activité et vos revenus.",
    icon: Briefcase,
    color: "purple"
  }
];

const colorClasses = {
  blue: {
    bg: "from-blue-50 to-blue-100",
    icon: "from-blue-500 to-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200"
  },
  emerald: {
    bg: "from-emerald-50 to-emerald-100",
    icon: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  purple: {
    bg: "from-purple-50 to-purple-100",
    icon: "from-purple-500 to-purple-600",
    badge: "bg-purple-100 text-purple-700 border-purple-200"
  },
  orange: {
    bg: "from-orange-50 to-orange-100",
    icon: "from-orange-500 to-orange-600",
    badge: "bg-orange-100 text-orange-700 border-orange-200"
  },
  pink: {
    bg: "from-pink-50 to-pink-100",
    icon: "from-pink-500 to-pink-600",
    badge: "bg-pink-100 text-pink-700 border-pink-200"
  },
  indigo: {
    bg: "from-indigo-50 to-indigo-100",
    icon: "from-indigo-500 to-indigo-600",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200"
  },
  amber: {
    bg: "from-amber-50 to-amber-100",
    icon: "from-amber-500 to-amber-600",
    badge: "bg-amber-100 text-amber-700 border-amber-200"
  }
};

export default function Guide() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Guide d'utilisation
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez comment tirer le meilleur parti de omnivyn intérim avec nos guides détaillés et conseils pratiques
          </p>
        </div>

        {/* Conseils rapides */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-50 to-slate-50">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Conseils pratiques
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {conseils.map((conseil, index) => {
                const Icon = conseil.icon;
                const colors = colorClasses[conseil.color];
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.icon} shadow-lg flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{conseil.titre}</h4>
                      <p className="text-sm text-slate-600">{conseil.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Guides par catégorie */}
        {guides.map((guide, guideIndex) => {
          const Icon = guide.icon;
          const colors = colorClasses[guide.color];
          
          return (
            <div key={guideIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.icon} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{guide.categorie}</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {guide.articles.map((article, articleIndex) => (
                  <Card key={articleIndex} className={`border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br ${colors.bg}`}>
                    <CardHeader className="border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                      <CardTitle className="text-lg">{article.titre}</CardTitle>
                      <p className="text-sm text-slate-600 mt-2">{article.description}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {article.etapes.map((etape, etapeIndex) => (
                          <div key={etapeIndex} className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors.icon} flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold`}>
                              {etapeIndex + 1}
                            </div>
                            <p className="text-sm text-slate-700 pt-0.5">{etape}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* Besoin d'aide */}
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
            <p className="text-blue-100 mb-6">
              Notre équipe est là pour vous accompagner dans l'utilisation de omnivyn intérim
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer px-4 py-2">
                contact@omnivyn.fr
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer px-4 py-2">
                01 23 45 67 89
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}