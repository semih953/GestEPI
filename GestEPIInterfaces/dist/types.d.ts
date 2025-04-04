export declare enum EPIType {
    CORDE = "CORDE",
    SANGLE = "SANGLE",
    LONGE = "LONGE",
    BAUDRIER = "BAUDRIER",
    CASQUE = "CASQUE",
    MOUSQUETON = "MOUSQUETON",
    SYSTEME_ASSURAGE = "SYSTEME_ASSURAGE"
}
export declare enum EPICategory {
    TEXTILE = "TEXTILE",
    METALLIQUE = "METALLIQUE"
}
export declare enum ControlStatus {
    OPERATIONNEL = "OPERATIONNEL",
    A_REPARER = "A_REPARER",
    MIS_AU_REBUT = "MIS_AU_REBUT"
}
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
    controlFrequency: number;
}
export interface Control {
    id?: number;
    epiId: number;
    controlDate: Date;
    manager: string;
    status: ControlStatus;
    remarks?: string;
}
export interface ControlAlert {
    epi: EPI;
    lastControl?: Control;
    daysUntilNextControl: number;
}
