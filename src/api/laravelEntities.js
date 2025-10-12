import laravelClient from './laravelClient';

// Fonction pour transformer les données Laravel en format compatible Base44
function transformLaravelData(data) {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => transformLaravelData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const transformed = { ...data };
    
    // Transformer les relations d'objets en chaînes simples
    if (transformed.entreprise && typeof transformed.entreprise === 'object') {
      transformed.entreprise_data = transformed.entreprise; // Garder l'objet complet sous un autre nom
      transformed.entreprise = transformed.entreprise.nom; // Remplacer par le nom
      transformed.entreprise_id = transformed.entreprise_data.id;
    }
    
    if (transformed.interimaire && typeof transformed.interimaire === 'object') {
      transformed.interimaire_data = transformed.interimaire;
      transformed.interimaire = transformed.interimaire.nom_complet;
      transformed.interimaire_id = transformed.interimaire_data.id;
    }
    
    if (transformed.mission && typeof transformed.mission === 'object') {
      transformed.mission_data = transformed.mission;
      transformed.mission = transformed.mission.titre;
      transformed.mission_id = transformed.mission_data.id;
    }
    
    // Convertir les nombres décimaux en nombres JS
    if (transformed.note && typeof transformed.note === 'string') {
      transformed.note = parseFloat(transformed.note);
    }
    if (transformed.taux_horaire && typeof transformed.taux_horaire === 'string') {
      transformed.taux_horaire = parseFloat(transformed.taux_horaire);
    }
    if (transformed.taux_horaire_souhaite && typeof transformed.taux_horaire_souhaite === 'string') {
      transformed.taux_horaire_souhaite = parseFloat(transformed.taux_horaire_souhaite);
    }
    if (transformed.montant && typeof transformed.montant === 'string') {
      transformed.montant = parseFloat(transformed.montant);
    }
    if (transformed.salaire && typeof transformed.salaire === 'string') {
      transformed.salaire = parseFloat(transformed.salaire);
    }
    if (transformed.heures_travaillees && typeof transformed.heures_travaillees === 'string') {
      transformed.heures_travaillees = parseFloat(transformed.heures_travaillees);
    }
    
    // Convertir les dates en format ISO si elles sont valides
    const dateFields = [
      'date_debut', 'date_fin', 'date_signature', 'date_naissance',
      'date_paiement', 'periode_debut', 'periode_fin',
      'date_signature_entreprise', 'date_signature_interimaire',
      'date_generation', 'created_at', 'updated_at'
    ];
    
    dateFields.forEach(field => {
      if (transformed[field]) {
        // Vérifier si c'est déjà un objet Date valide
        if (!(transformed[field] instanceof Date)) {
          // Essayer de convertir en Date
          const date = new Date(transformed[field]);
          // Vérifier que la date est valide
          if (!isNaN(date.getTime())) {
            transformed[field] = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
          }
        }
      }
    });
    
    return transformed;
  }
  
  return data;
}

// Classe de base pour les entités
class BaseEntity {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // Liste les entités (compatible avec Base44: list(sortBy, limit))
  async list(sortBy = '-created_at', limit = 100, filters = {}) {
    try {
      const params = {
        per_page: limit,
        ...filters
      };

      // Gérer le tri Base44 style (-created_date)
      if (sortBy) {
        const order = sortBy.startsWith('-') ? 'desc' : 'asc';
        let field = sortBy.replace('-', '');
        
        // Mapper les champs Base44 vers Laravel
        const fieldMapping = {
          'created_date': 'created_at',
          'updated_date': 'updated_at'
        };
        
        field = fieldMapping[field] || field;
        
        params.sort = field;
        params.order = order;
      }

      const response = await laravelClient.get(this.endpoint, { params });
      
      // Retourner les données transformées (compatible Base44)
      const data = response.data.data || response.data;
      return transformLaravelData(data);
    } catch (error) {
      console.error(`Error listing ${this.endpoint}:`, error);
      return [];
    }
  }

  // Récupère une entité par ID
  async get(id) {
    try {
      const response = await laravelClient.get(`${this.endpoint}/${id}`);
      const data = response.data.data || response.data;
      return transformLaravelData(data);
    } catch (error) {
      console.error(`Error getting ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  // Crée une nouvelle entité
  async create(data) {
    try {
      const response = await laravelClient.post(this.endpoint, data);
      const responseData = response.data.data || response.data;
      return transformLaravelData(responseData);
    } catch (error) {
      console.error(`Error creating ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Met à jour une entité
  async update(id, data) {
    try {
      const response = await laravelClient.put(`${this.endpoint}/${id}`, data);
      const responseData = response.data.data || response.data;
      return transformLaravelData(responseData);
    } catch (error) {
      console.error(`Error updating ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }

  // Supprime une entité
  async delete(id) {
    try {
      const response = await laravelClient.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${this.endpoint}/${id}:`, error);
      throw error;
    }
  }
}

// Classe Mission avec méthodes spécifiques
class MissionEntity extends BaseEntity {
  constructor() {
    super('/missions');
  }

  async assignerInterimaire(missionId, interimaireId) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${missionId}/assigner`, {
        interimaire_id: interimaireId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning interimaire:', error);
      throw error;
    }
  }

  async terminer(missionId) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${missionId}/terminer`);
      return response.data;
    } catch (error) {
      console.error('Error terminating mission:', error);
      throw error;
    }
  }

  async getOuvertes() {
    try {
      const response = await laravelClient.get(`${this.endpoint}/ouvertes`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting open missions:', error);
      return [];
    }
  }
}

// Classe Interimaire avec méthodes spécifiques
class InterimaireEntity extends BaseEntity {
  constructor() {
    super('/interimaires');
  }

  async getDisponibles() {
    try {
      const response = await laravelClient.get(`${this.endpoint}/disponibles`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting available interimaires:', error);
      return [];
    }
  }

  async getMissions(interimaireId) {
    try {
      const response = await laravelClient.get(`${this.endpoint}/${interimaireId}/missions`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting interimaire missions:', error);
      return [];
    }
  }

  async getPaiements(interimaireId) {
    try {
      const response = await laravelClient.get(`${this.endpoint}/${interimaireId}/paiements`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting interimaire paiements:', error);
      return [];
    }
  }
}

// Classe Entreprise avec méthodes spécifiques
class EntrepriseEntity extends BaseEntity {
  constructor() {
    super('/entreprises');
  }

  async getMissions(entrepriseId) {
    try {
      const response = await laravelClient.get(`${this.endpoint}/${entrepriseId}/missions`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting entreprise missions:', error);
      return [];
    }
  }

  async getPaiements(entrepriseId) {
    try {
      const response = await laravelClient.get(`${this.endpoint}/${entrepriseId}/paiements`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error getting entreprise paiements:', error);
      return [];
    }
  }
}

// Classe Paiement avec méthodes spécifiques
class PaiementEntity extends BaseEntity {
  constructor() {
    super('/paiements');
  }

  async valider(paiementId) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${paiementId}/valider`);
      return response.data;
    } catch (error) {
      console.error('Error validating paiement:', error);
      throw error;
    }
  }

  async payer(paiementId) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${paiementId}/payer`);
      return response.data;
    } catch (error) {
      console.error('Error paying paiement:', error);
      throw error;
    }
  }
}

// Classe Document avec méthodes spécifiques
class DocumentEntity extends BaseEntity {
  constructor() {
    super('/documents');
  }

  async upload(file, data) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nom', data.nom || file.name);
      formData.append('type', data.type);
      
      // Ajouter les champs optionnels
      if (data.interimaire_id) formData.append('interimaire_id', data.interimaire_id);
      if (data.date_validite) formData.append('date_validite', data.date_validite);
      if (data.statut) formData.append('statut', data.statut);
      if (data.notes) formData.append('notes', data.notes);
      
      // Pour la relation polymorphique
      formData.append('documentable_type', data.documentable_type || 'App\\Models\\Interimaire');
      formData.append('documentable_id', data.documentable_id || data.interimaire_id);

      const response = await laravelClient.post(`${this.endpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseData = response.data.document || response.data.data || response.data;
      return transformLaravelData(responseData);
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
}

// Classe Contrat avec méthodes spécifiques
class ContratEntity extends BaseEntity {
  constructor() {
    super('/contrats');
  }

  async signerEntreprise(contratId, signature) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${contratId}/signer-entreprise`, {
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Error signing contrat (entreprise):', error);
      throw error;
    }
  }

  async signerInterimaire(contratId, signature) {
    try {
      const response = await laravelClient.post(`${this.endpoint}/${contratId}/signer-interimaire`, {
        signature
      });
      return response.data;
    } catch (error) {
      console.error('Error signing contrat (interimaire):', error);
      throw error;
    }
  }
}

// Classe Auth (User)
class AuthEntity {
  async register(data) {
    try {
      const response = await laravelClient.post('/register', data);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await laravelClient.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await laravelClient.post('/logout');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
      // Même en cas d'erreur, on nettoie le localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    try {
      const response = await laravelClient.get('/user');
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  // Méthode pour récupérer l'utilisateur du localStorage
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Exporter les instances (compatible avec Base44)
export const Mission = new MissionEntity();
export const Interimaire = new InterimaireEntity();
export const Entreprise = new EntrepriseEntity();
export const Paiement = new PaiementEntity();
export const Document = new DocumentEntity();
export const Contrat = new ContratEntity();
export const User = new AuthEntity();
