export interface Loan {
    id_prestamo: number;
    nombre_completo: string;
    area: string;
    puesto: string;
    monto: number;
    motivo: string;
    confirmacion_trabajador?: boolean;
    confirmacion_bs?: boolean;
    confirmacion_gerente_rh?: boolean;
}
