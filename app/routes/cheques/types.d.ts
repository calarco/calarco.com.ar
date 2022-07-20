type Pagos = {
    total: number;
    limit: number;
    skip: number;
    data: Pago[];
};

type Pago = {
    id: number;
    emision: string;
    pago: string;
    monto: number;
    destinatarioId: number;
    numero: string;
    observaciones: string;
    estado: string;
    createdAt: string;
    updatedAt: string;
};

type Cobros = {
    total: number;
    limit: number;
    skip: number;
    data: Cobro[];
};

type Cobro = {
    id: number;
    emision: string;
    deposito: string;
    monto: number;
    libradoreId: number;
    numero: string;
    bancoId: number;
    titular?: string;
    cuit?: string;
    observaciones: string;
    estado: string;
    salidaDate?: string;
    destinatarioId?: number;
    createdAt: string;
    updatedAt: string;
};

type Total = {
    total: number;
    limit: number;
    skip: number;
    data: [{ total: number }];
};

type PagoInputs = {
    pago?: string;
    monto?: string;
    destinatarioId?: number;
    destinatario?: string;
    emision?: string;
    numero?: string;
    observaciones?: string;
    estado?: string;
};

type CobroInputs = {
    deposito?: string;
    monto?: string;
    destinatarioId?: number;
    destinatario?: string;
    libradoreId?: number;
    librador?: string;
    emision?: string;
    salida?: string;
    bancoId?: number;
    banco?: string;
    numero?: string;
    titular?: string;
    cuit?: string;
    observaciones?: string;
    estado?: string;
};
