import { Type } from "../abstract/Retorno";

export class Symbol {
    /**
     * Clase que guarda toda la informacion importante de una variable 
     * y despues sera almacenada en su respectiva tabla de simbolos.
     * Porque hay que recordar que en este proyecto se utilizaron ambientes.
     */
    constructor(
        public value: any,
        public id: string,
        public type: Type
    ) {

    }
}