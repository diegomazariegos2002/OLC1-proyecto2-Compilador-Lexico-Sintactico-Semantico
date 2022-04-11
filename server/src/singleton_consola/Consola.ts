import { Instruccion } from "../abstract/Instruccion"

/**
 * En esta clase aplico el patrón de diseño Singleton 
 * esto para poder utilizar la clase globalmente de una forma
 * segura en toda la lógica del proyecto, es la que se encarga
 * de juntar todas las instrucciones que tengan impresión de datos como salida.
 */
export class Consola {
    private static instance: Consola
    private error: string = ""
    private ast: string = ""
    private entorno: string = ""
    private consola: string = ""
    private pila: Instruccion[] = []

    private constructor() { }

    public static getInstance(): Consola {
        if (!Consola.instance) {
            Consola.instance = new Consola();
        }
        return Consola.instance;
    }

    /**
   * Agrega un error a la lista.
   *
   * @remarks
   * Recibe un objeto {tipo,descripcion, linea, columna} el cual es almacenado con un formato <tr> para presentar como una table en html
   *
   */
    public add_error(data: any) {
        this.error +=
            "<tr>" +
            "<td>" + data.titulo + "</td>" +
            "<td>" + data.descripcion + "</td>" +
            "<td>" + data.linea + "</td>" +
            "<td>" + data.columna + "</td>" +
            "</tr>"
    }

    /**
     * 
     * @returns un string con el codigo con el formato html para reportar
     */
    public get_error() {
        return `
        <table border=1 style="width: 75%;margin: 0 auto;" cellpadding ="5">
            <tr>
                <th>Tipo error</th>
                <th>Descripcion</th>
                <th>Linea</th>
                <th>Columna</th>
            </tr>${this.error}
        </table>`
    }

    public add_ast(data: string) {
        this.ast += data
    }
    public get_ast(): string {
        return this.ast
    }
    public add_consola(data: string) {
        this.consola += data
    }
    public get_consola(): string {
        return this.consola
    }
    /**
     * add_pila
     */
    public add_pila(data:Instruccion) {
        this.pila.push(data)
    }
    public add_entorno(data:string){
        this.entorno+=data
    }
    public get_entorno():string{
        return this.entorno
    }
}