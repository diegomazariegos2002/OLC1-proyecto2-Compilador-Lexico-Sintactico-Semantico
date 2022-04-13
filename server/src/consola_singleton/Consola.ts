import { Excepcion } from "../errores/Excepcion";

/**
 * Clase consola que se basa en el Patrón de diseño Consola
 */
export class Consola {
    private static instance: Consola;
    private consola: string = "";
    private ast: string = "";
    private errores: Excepcion[] = [];

    private constructor(){}

    public static getInstance(): Consola{
        if (!Consola.instance) {
            Consola.instance = new Consola();
        }
        return Consola.instance;
    }

    public cleanConsola(){
        this.consola = "";
    }

    /**===================================== MÉTODOS GET AND SET ===================================== */

    public setConsola(entrada : string) {
        this.consola += entrada;
    }
    

    public getConsola() : string {
        return this.consola;
    }
    
    public set_Ast(data: string) {
        this.ast += data
    }

    public get_Ast(): string {
        return this.ast
    }

    public set_Error(data: Excepcion) {
        this.consola += "Error: " + data.titulo + ", " + data.descripcion + ", en la línea: " + data.linea + ", en la columna: " + data.columna + ".";
        this.errores.push(data);
    }

    public get_Errores() : Excepcion[] {
        return this.errores;
    }
    
}