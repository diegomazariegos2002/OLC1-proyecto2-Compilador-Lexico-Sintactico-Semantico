/*CLASE DONDE DECLARO LOS TIPOS DE VARIABLES QUE HAY EN MI LENGUAJE*/
export enum Tipo {
    /*0*/INT,
    /*1*/DOUBLE,
    /*2*/CHAR,
    /*3*/STRING,
    /*4*/BOOLEAN,
    /*5*/VOID,
    /*6*/VECTOR,
    /*7*/ERROR
}

export type Retorno = {
    value: any,
    type: Tipo
}