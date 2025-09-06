//utils/models.ts
export interface IColonne {
  _id: string;
  nom: string;
  type: 'texte' | 'nombre';
  lignes?: ILigne[]; 
}

export interface ICellule {
  _id: string;
  colonne: IColonne;
  valeur: string | number;
}

export interface ILigne {
  _id: string;
  valeurs: ICellule[];
}

export interface ITableau {
  _id: string;
  titre: string;
  auteur: IUser; 
  departement: string;
  colonnes: IColonne[];
  lignes: ILigne[];
}

export interface IUser {
  _id: string;
  nom: string;
  email: string;
  password?: string; 
  role: "Cadre" | "Operateur" | "Admin" | "En attente";
  departement: string;
}



export interface IPublication {
  _id: string;
  titre: string;
  description: string;
  type: "reclamation" | "demande" | "incident" | "audit" | "information" | "autre";
  auteur: IUser; 
  departement: string;
  image?: string;
  dateDebut?: string;
  dateFin?: string;
  deleted: boolean;
  statut: "ouverte" | "en cours" | "traitée";
}


export interface INotification {
  _id: string;
  destinataire: IUser; 
  description: string;
  type: "nouvellePublication" | "tacheAssignée" | "message" | "info";
  referenceId?: string;
  lu: boolean;
  dateEnvoi: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface IMessage {
  _id: string;
  titre: string;
  contenu: string;
  auteur: IUser;
  departement: string;
  dateDebut?: string;
  dateFin?: string;
  deleted: boolean;
  statut: "à venir" | "en cours" | "terminée" | "programmée"| "tache"; 
}

export interface IDepartement {
  _id: string;
  nom: string;
}

export interface NotRes {
  count: number;
  notifications: INotification[];
}



