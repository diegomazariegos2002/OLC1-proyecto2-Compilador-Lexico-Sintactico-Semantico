import { Consola } from "./consola_singleton/Consola";
import { Declaracion_Var } from "./instrucciones/Declaracion_Var";
import { InsFuncion } from "./instrucciones/InsFuncion";
import { Run } from "./instrucciones/Run";
import { Environment } from "./simbolo/Environment";

/* Aquí van los imports de mis librerías*/
var express = require('express');
const res = require('express/lib/response');
var morgan = require('morgan');
var cors = require('cors');
var app = express();
var corsOptions = { origin: true, optionsSuccessStatus: 200 };

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

//Importando la gramatica generada
const parser = require('./analizadores/gramatica.js');

var puerto = 8080;
var incremental = 0;

app.post('/analizar', function (request: any, response: any) {


    var entrada = request.body.entrada;
    console.log("Estoy analizando");
    console.log(entrada);
    var consola = Consola.getInstance();
    consola.cleanConsola();
    //realizando el analisis de la entrada.
    var ast;
    try {
        ast = parser.parse(entrada);
    } catch (error) {
        console.log("Soy un error " + error)
        ast = [];
    }
    const env = new Environment(null, "global");

    //primera pasada donde se ejecutan todas las instrucciones de funciones
    for (const instruccion of ast) {
        try {
            if (instruccion instanceof InsFuncion || instruccion instanceof Declaracion_Var) {
                instruccion.execute(env)
            }
        } catch (error) {
            console.log("soy un error" + error)
        }
    }

    var existeRun: boolean = false;

    /**
     * Segunda pasada para verificar si existe un Run en el código
     * En todo caso solo se debería de ejecutar el Run();
     */
    for (const instruccion of ast) {
        try {
            if (instruccion instanceof Run) {
                existeRun = true;
                instruccion.execute(env)
            }
        } catch (error) {
            console.log("soy un error" + error)
        }
    }

    //Tercera pasada donde ya se ejecutan todas las instrucciones a excepción de las funciones si es que no existe Run();
    if (!existeRun) {
        for (const instruccion of ast) {
            try {
                if (!(instruccion instanceof InsFuncion)) {
                    instruccion.execute(env)
                }
            } catch (error) {
                console.log("soy un error" + error)
            }
        }
    }
    
    /**For para armar el ast de las instrucciones */
    consola.set_Ast("digraph G { \nnode[shape=box];\nnodeInicio[label=\"<\\ INICIO \\>\"];\n\n");
    var cont = 0;
    var inst_line_anterior = 0;
    var inst_col_anterior = 0;

    for (const instruccion of ast) {
        try {
            if (cont == 0) {
                consola.set_Ast(`nodeInicio->instruccion_${instruccion.line}_${instruccion.column}_;\n`);
                inst_line_anterior = instruccion.line;
                inst_col_anterior = instruccion.column;
            } else {
                consola.set_Ast(`instruccion_${inst_line_anterior}_${inst_col_anterior}_->instruccion_${instruccion.line}_${instruccion.column}_;\n`);
                inst_line_anterior = instruccion.line;
                inst_col_anterior = instruccion.column;
            }

            instruccion.ast()

        } catch (error) {
            console.log("soy un error" + error)
        }
        cont++;
    }

    consola.set_Ast("}"); //para cerrar el dot porque es más práctico hacerlo aquí que en la gramática

    /* Salida de datos */
    var salida =
    {
        entrada: entrada,
        consola: consola.getConsola(),
        errores: consola.get_Errores(),
        ast: consola.get_Ast(),
        simbolos: consola.get_Simbolos(),
        resultado: ast
    }
    response.json(salida)
})

app.listen(puerto, function () {
    console.log('app escuchando en el puerto 8080')
})

app.get('/', function (request: any, response: any) {
    response.json({ Mensaje: 'Hola mundoooos!!!' })
})

app.get('/retornoTexto', function (request: any, response: any) {
    response.send('Este mensaje es un texto')
})

app.get('/getIncremental', function (request: any, response: any) {
    response.send({ Mensaje: 'Este mensaje es un incremental ' + incremental })
})

app.post('/setIncremental', function (request: any, response: any) {
    incremental = request.body.dato;
    response.json({ msg: "Operación con éxito!!!" })
})