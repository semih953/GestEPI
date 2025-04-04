// Types d'EPI
export enum EPIType {
    CORDE = "CORDE",
    SANGLE = "SANGLE",
    LONGE = "LONGE",
    BAUDRIER = "BAUDRIER",
    CASQUE = "CASQUE",
    MOUSQUETON = "MOUSQUETON",
    SYSTEME_ASSURAGE = "SYSTEME_ASSURAGE"
  }
  
  // Catégories d'EPI
  export enum EPICategory {
    TEXTILE = "TEXTILE",
    METALLIQUE = "METALLIQUE"
  }
  
  // Statut d'un contrôle
  export enum ControlStatus {
    OPERATIONNEL = "OPERATIONNEL",
    A_REPARER = "A_REPARER",
    MIS_AU_REBUT = "MIS_AU_REBUT"
  }
  
  // Interface EPI
  export interface EPI {
    id?: number;
    customId: string;
    type: EPIType;
    category: EPICategory;
    brand: string;
    model: string;
    serialNumber: string;
    purchaseDate: Date;
    manufacturingDate: Date;
    commissioningDate: Date;
    size?: string;
    color?: string;
    controlFrequency: number; // en jours
  }
  
  // Interface Contrôle
  export interface Control {
    id?: number;
    epiId: number;
    controlDate: Date;
    manager: string;
    status: ControlStatus;
    remarks?: string;
  }
  
  // Interface pour les alertes de contrôle
  export interface ControlAlert {
    epi: EPI;
    lastControl?: Control;
    daysUntilNextControl: number;
  }