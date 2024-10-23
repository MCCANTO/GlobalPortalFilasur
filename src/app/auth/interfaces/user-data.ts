export interface UserData {
    Usuario: string;
    Nombre: string;
    Modulo: string;
    Linea: number;
    LineaDesc: string;
    Rol: number;
    RolDesc: string;
    Articulo: string;
    Cantidad: string;
    Fecha: Date;
    Orden: string;
}

export interface UserDataCustomize {
    certserialnumber: string;
    username: string;
    usercode: string;
    nombre: string;
    rol: string;
    email: string;
    dni: string;
    readonly: string;
    hash: string;
    api: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
  }