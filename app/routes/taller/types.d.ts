type Cliente = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono: string;
    empresa: string;
    createdAt: string;
    updatedAt: string;
};

type Vehiculo = {
    id: number;
    patente: string;
    year: string;
    combustible: string;
    cilindrada: string;
    vin: string;
    createdAt: string;
    updatedAt: string;
    clienteId: number;
    modeloId: number;
};

type Reparacion = {
    id: number;
    vehiculoId: number;
    reparacion: string;
    repuestos: string;
    labor: string;
    costo: string;
    km: string;
    createdAt: string;
    updatedAt: string;
};

type Presupuesto = {
    id: number;
    patente: string;
    km: string;
    motivo: string;
    labor: string;
    repuestos: { cantidad: string; repuesto: string; precio: string }[];
    createdAt: string;
    updatedAt: string;
    modeloId: number;
};

type Turno = {
    id: number;
    fecha: string;
    motivo: string;
    createdAt: string;
    updatedAt: string;
    modeloId: number;
};

type Fabricante = {
    id: number;
    nombre: string;
    createdAt: string;
    updatedAt: string;
};

type Modelo = {
    id: number;
    nombre: string;
    createdAt: string;
    updatedAt: string;
    fabricanteId: number;
};
