/*CLASE DONDE DECLARO LOS TIPOS DE VARIABLES QUE HAY EN MI LENGUAJE*/
export enum Type {
    /*0*/INT,
    /*1*/DOUBLE,
    /*2*/CHAR,
    /*3*/STRING,
    /*4*/BOOLEAN,
    /*5*/VOID,
    /*6*/error
}
/**
 * 
 * @param objeto Objeto tipo Type
 * @returns String con el nombre del tipo 
 */
export function get(objeto: Type): string {
    switch (objeto) {
        case 0:
            return "number"
        case 1:
            return "string"
        case 2:
            return "boolean"
        default:
            return ""
    }
}

export type Retorno = {
    value: any,
    type: Type
}