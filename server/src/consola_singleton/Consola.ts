import { Tipo } from "../abstracto/Retorno";
import { Excepcion } from "../errores/Excepcion";
import { Simbolo } from "../simbolo/Simbolo";

/**
 * Clase consola que se basa en el Patrón de diseño Consola
 */
export class Consola {
    private static instance: Consola;
    private consola: string = "";
    private ast: string = "";
    private errores: Excepcion[] = [];
    private simbolos: Simbolo[] = [];

    private constructor(){}

    public static getInstance(): Consola{
        if (!Consola.instance) {
            Consola.instance = new Consola();
        }
        return Consola.instance;
    }

    public cleanConsola(){
        this.consola = "";
        this.ast =  "";
        this.errores = [];
        this.simbolos = [];
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
        this.consola += "Error: " + data.titulo + ", " + data.descripcion + ", en la línea: " + data.linea + ", en la columna: " + data.columna + ".\n";
        this.errores.push(data);
    }

    public get_Errores() : Excepcion[] {
        return this.errores;
    }
    
    public set_Simbolo(data: Simbolo) {
        this.simbolos.push(data);
    }

    public get_Simbolos() : Simbolo[] {
        return this.simbolos;
    }

    public getTipo(tipo: Tipo | undefined): string{
        switch(tipo){
            case Tipo.INT:
                return "int";
            case Tipo.DOUBLE:
                return "double";
            case Tipo.CHAR:
                return "char";
            case Tipo.STRING:
                return "string";
            case Tipo.BOOLEAN:
                return "boolean";
            case Tipo.VOID:
                return "void";
            case Tipo.VECTOR:
                return "vector";
            default:
                return "error";
        }
    }
}