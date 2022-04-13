export class Excepcion {
    /**
     * 
     * @param titulo Clasifica el tipo de Excepcion que se detecto, puede ser: lexico, sintactico o semantico
     * @param descripcion Detalle del Excepcion que se detecto
     * @param linea Linea en donde se encontro el Excepcion
     * @param columna Columna en donde se encontro el Excepcions
     */
    constructor(
        public titulo: string,
        public descripcion: string,
        public linea: number,
        public columna: number
    ) { }
}