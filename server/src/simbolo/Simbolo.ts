import { Tipo } from "../abstracto/Retorno";

export class Simbolo {
    /**
     * Clase que guarda toda la informacion importante de una variable 
     * y despues sera almacenada en su respectiva tabla de simbolos.
     * Porque hay que recordar que en este proyecto se utilizaron ambientes.
     */
    constructor(
        public valor: any,
        public id: string,
        public tipo: Tipo,
        public ambito: string,
        public tipoString: string,
        public editable: boolean,
        public linea: number,
        public columna: number
    ) {

    }
}