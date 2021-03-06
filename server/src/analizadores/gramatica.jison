/* Gramatica  */
/* Código de Javascript analizador léxico */
%{
    var cadena = '';
    var errores = [];
%}
/* Comienzo analizador léxico */
%lex
/* Ajustes del analizador léxico */
%options case-insensitive
%x string

%% 

["]				{ cadena = ''; this.begin("string"); }
<string>[^"\\]+			{ cadena += yytext; }
<string>"\\\""			{ cadena += "\""; }
<string>"\n"			{ cadena += "\n"; }
<string>\s			{ cadena += " ";  }
<string>"\t"			{ cadena += "\t"; }
<string>"\\\\"			{ cadena += "\\"; }
<string>"\'"			{ cadena += "\'"; }
<string>"\r"			{ cadena += "\r"; }
<string>["]		        { yytext = cadena; this.popState(); return 'cadena'; }

\s+                                 /* Espacio en blanco (los ignora) */
"//"[^\r\n]*[\r|\n|\r\n]?			// Comentario de una linea (los ignora)
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /* Comentario Multilinea (los ignora) */

//Palabras reservadas
"int"                   return 'int'
"double"                return 'double'
"boolean"               return 'boolean'
"char"                  return 'char'
"string"                return 'string'
"true"                  return 'true'
"false"                 return 'false'
"new"                   return 'new'
"if"                    return 'if'
"else"                  return 'else'
"switch"                return 'switch'
"case"                  return 'case'
"default"               return 'default'
"println"               return 'println'
"print"                 return 'print'
"break"                 return 'break'
"while"                 return 'while'
"for"                   return 'for'
"do"                    return 'do'
"continue"              return 'continue'
"return"                return 'return'
"void"                  return 'void'
"toLower"               return 'toLower'
"toUpper"               return 'toUpper'
"Round"                 return 'round'
"length"                return 'length'
"Typeof"                return 'TypeOf'
"tostring"              return 'to_String'
"toCharArray"           return 'toCharArray'
"run"                   return 'run'

//Simbolos
"++" /*incremento*/     return 'incremento'      
"--" /*decremento*/     return 'decremento'
"+" /*mas*/             return 'mas'
"-" /*menos*/           return 'menos'
"*" /*multiplicacion*/  return 'multiplicacion'
"/" /*division*/        return 'division'
"^"  /*exponente*/      return 'exponente'
"%" /*Modulo*/          return 'modulo'    
"==" /*igualacion*/     return 'igualacion'
"!=" /*Diferenciacion*/ return 'diferenciacion'
"<=" /*menorIgualQue*/  return 'menorIgualQue'
">=" /*mayorIgualQue*/  return 'mayorIgualQue'
"<" /*menorQue*/        return 'menorQue'
">" /*mayorQue*/        return 'mayorQue'    
"=" /*igual*/           return 'igual'
"?" /*interrogacion*/   return 'interrogacion'
":" /*dosPuntos*/       return 'dosPuntos'
";" /*puntoYcoma*/      return 'puntoYcoma'
"||" /*or*/             return 'or'
"&&" /*and*/            return 'and'
"!" /*NOT*/             return 'not'
"(" /*ParentesisAbre*/  return 'parentesisAbre'
")" /*ParentesisCierra*/return 'parentesisCierra'
"{" /*LlaveAbre*/       return 'llaveAbre'
"}" /*LlaveCierra*/     return 'llaveCierra'
"[" /*CorcheteAbre*/    return 'corcheteAbre'
"]" /*CorcheteCierra*/  return 'corcheteCierra'
","                     return 'coma'

//Extras
([a-zA-Z])[a-zA-Z0-9_]* /*Identificador*/ return 'identificador'
[']\\\\[']|[']\\\"[']|[']\\\'[']|[']\\n[']|[']\\t[']|[']\\r[']|['].?[']	return 'caracter'
[0-9]+("."[0-9]+)+\b	                return 'decimal'
[0-9]+					return 'entero'

<<EOF>>               return 'EOF'
.                     { console.log("Error léxico" + yytext + ", en la línea "+yylloc.first_line+", en la columna "+yylloc.first_column); }

/**
 * Agregar en la parte de error léxico lo siguiente:
console.log("Error léxico" + yy_.yytext + ", en la línea "+yy_.yylloc.first_line+", en la columna "+yy_.yylloc.first_column); 
const error = new Excepcion("Error léxico", `no se reconoce '${yy_.yytext}' en el lenguaje`, yy_.yylloc.first_line, yy_.yylloc.first_column);
consola.set_Error(error);
return 'invalid'
*/

/lex //fin analizador léxico

/* Comienzo analizador sintáctico */
// Importaciones
%{
	//Importanción de instrucciones
	const { Print } = require('../instrucciones/Print.ts');
        const { Println } = require('../instrucciones/Println.ts');
        const { Declaracion_Var } = require('../instrucciones/Declaracion_Var.ts');
        const { Asignacion } = require('../instrucciones/Asignacion.ts');
        const { Bloque } = require('../instrucciones/Bloque.ts');
        const { InsFuncion } = require('../instrucciones/InsFuncion.ts');
        const { Run } = require('../instrucciones/Run.ts');
                //Sentecias de transición
        const { Break } = require('../instrucciones/sentencias_de_transicion/Break.ts');
        const { Continue } = require('../instrucciones/sentencias_de_transicion/Continue.ts');
        const { Return } = require('../instrucciones/sentencias_de_transicion/Return.ts');
                //Instrucciones de sentencias de control
        const { If } = require('../instrucciones/sentencias_de_control/If.ts');
        const { Switch } = require('../instrucciones/sentencias_de_control/Switch.ts');
        const { Case } = require('../instrucciones/sentencias_de_control/Case.ts');
        const { Default } = require('../instrucciones/sentencias_de_control/Default.ts');
                //Instrucciones ciclicas
        const { For } = require('../instrucciones/sentencias_ciclicas/For.ts');
        const { While } = require('../instrucciones/sentencias_ciclicas/While.ts');
        const { Do_While }  = require('../instrucciones/sentencias_ciclicas/Do_While.ts');
                //Instrucciones aritmeticas
        const { Incremento_Ins } = require('../instrucciones/aritmetica/Incremento_Ins.ts');        
        const { Decremento_Ins } = require('../instrucciones/aritmetica/Decremento_Ins.ts');
        //Importación de expresiones
        const { Literal } = require('../expresiones/Literal.ts');
        const { Identificador } = require('../expresiones/Identificador.ts');
        const { Casteo } = require('../expresiones/Casteo.ts');
        const { Llamada } = require('../expresiones/Llamada.ts');
                //expresiones aritméticas
        const { Suma } = require('../expresiones/aritmetica/Suma.ts');
        const { Resta } = require('../expresiones/aritmetica/Resta.ts');
        const { Multiplicacion } = require('../expresiones/aritmetica/Multiplicacion.ts');
        const { Division } = require('../expresiones/aritmetica/Division.ts');
        const { Potencia } = require('../expresiones/aritmetica/Potencia.ts');
        const { Modulo } = require('../expresiones/aritmetica/Modulo.ts');
        const { Negado } = require('../expresiones/aritmetica/Negado.ts');
        const { Incremento_Exp } = require('../expresiones/aritmetica/Incremento_Exp.ts');
        const { Decremento_Exp } = require('../expresiones/aritmetica/Decremento_Exp.ts');
                //expresiones de operaciones relacionales
        const { Igualacion } = require('../expresiones/operaciones_relacionales/Igualacion.ts');
        const { Diferenciacion } = require('../expresiones/operaciones_relacionales/Diferenciacion.ts');
        const { Menor_Que } = require('../expresiones/operaciones_relacionales/Menor_Que.ts');
        const { Mayor_Que } = require('../expresiones/operaciones_relacionales/Mayor_Que.ts');
        const { Mayor_Igual_Que } = require('../expresiones/operaciones_relacionales/Mayor_Igual_Que.ts');
        const { Menor_Igual_Que } = require('../expresiones/operaciones_relacionales/Menor_Igual_Que.ts');
                //expresiones de operaciones lógicos
        const { Or } = require('../expresiones/operadores_logicos/Or.ts');
        const { And } = require('../expresiones/operadores_logicos/And.ts');
        const { Not } = require('../expresiones/operadores_logicos/Not.ts');
                //expresiones de funciones reservadas
        const { ToString } = require('../expresiones/funciones_reservadas/ToString.ts');
        const { Length } = require('../expresiones/funciones_reservadas/Length.ts');
        const { Round } = require('../expresiones/funciones_reservadas/Round.ts');
        const { toLower } = require('../expresiones/funciones_reservadas/toLower.ts');
        const { toUpper } = require('../expresiones/funciones_reservadas/toUpper.ts');
        const { TypeOf } = require('../expresiones/funciones_reservadas/TypeOf.ts');

        //Importación de herramientas auxiliares
        const { Consola } = require('../consola_singleton/Consola.ts');
        const { Tipo } = require('../abstracto/Retorno.ts');
        const { Excepcion } = require('../errores/Excepcion.ts');
        const { Retorno } = require('../abstracto/Retorno.ts');
        var consola = Consola.getInstance();
%}

/* Precedencias */
%left 'or'
%left 'and'
%right 'not'
%left 'igualacion' 'diferenciacion' 'menorQue' 'menorIgualQue' 'mayorQue' 'mayorIgualQue'
%left 'mas' 'menos'
%left 'multiplicacion' 'division' 'modulo'
%right 'exponente'
%rigth 'incremento' 'decremento'
%left umenos
%left 'parentesisAbre' 

/* Comienzo gramatica */
%start INICIO

%% /* Producciones */

INICIO: 
        ENTRADAS EOF { return $1; }
        | EOF { return ""; }
;

ENTRADAS: 
        ENTRADAS ENTRADA {  if($2!=="") $1.push($2); $$=$1; }
        |  ENTRADA{ if($$!=="") $$=[$1]; else $$=[]; }
        | error puntoYcoma{ console.error('Este es un error sintáctico'); let retorno = {value: null, type: Tipo.ERROR}; return retorno;}
;

ENTRADA:    
        FUNCION { $$ = $1; }
        |   METODO { $$ = $1; }
        |   RUN { $$ = $1; }
        |   DECLARACION_VAR puntoYcoma { $$ = $1; }
        |   DECLARACION_VECT {}
        |   INSTRUCCION { $$ = $1; }
        |       error puntoYcoma {
                        console.log("Error sintáctico en la línea: "+(this._$.first_line)+" en la columna: "+(this._$.first_column));
                        /**
                        * Pegar en el error de la gramatica.js
                        console.log("Error sintáctico no se esperaba "+(yyloc.match)+" en la línea: "+(yylineno+1)+" en la columna: "+(yyloc.first_column)); 
                        const error = new Excepcion("Error sintáctico", "Error sintáctico no se esperaba "+(this.terminals_[symbol] || symbol)+" en la línea: "+(yylineno)+" en la columna: "+(yyleng), yylineno, yyleng);
                        consola.set_Error(error);
                        return [];
                        */
                        }
;

FUNCION: 
        identificador parentesisAbre parentesisCierra dosPuntos TIPO BLOQUE { $$ = new InsFuncion($1, $6, new Array(), $5, @1.first_line, @1.first_column); }
        |   identificador parentesisAbre LISTA_PARAMETROS parentesisCierra dosPuntos TIPO BLOQUE { $$ = new InsFuncion($1, $7, $3, $6, @1.first_line, @1.first_column); }
;

METODO:
        identificador parentesisAbre parentesisCierra dosPuntos void BLOQUE { $$ = new InsFuncion($1, $6, new Array(), Tipo.VOID, @1.first_line, @1.first_column); }
        |   identificador parentesisAbre LISTA_PARAMETROS parentesisCierra dosPuntos void BLOQUE { $$ = new InsFuncion($1, $7, $3, Tipo.VOID, @1.first_line, @1.first_column); }
        |   identificador parentesisAbre parentesisCierra BLOQUE { $$ = new InsFuncion($1, $4, new Array(), Tipo.VOID, @1.first_line, @1.first_column); }
        |   identificador parentesisAbre LISTA_PARAMETROS parentesisCierra BLOQUE { $$ = new InsFuncion($1, $5, $3, Tipo.VOID, @1.first_line, @1.first_column); }
;

LISTA_PARAMETROS:      
                LISTA_PARAMETROS coma TIPO identificador { $1.push(new Declaracion_Var([$4], null, $3, @1.first_line, @1.first_column)); $$ = $1;}
                |       TIPO identificador { $$ = [new Declaracion_Var([$2], null, $1, @1.first_line, @1.first_column)]; }
;

RUN: 
    run LLAMADA puntoYcoma { $$ = new Run($2, @1.first_line, @1.first_column); }
;

DECLARACION_VAR: 
            TIPO LISTA_VARIABLES { $$ = new Declaracion_Var($2, null, $1, @1.first_line, @1.first_column); }
            |   TIPO LISTA_VARIABLES igual EXPRESION { $$ = new Declaracion_Var($2, $4, $1, @1.first_line, @1.first_column); }
            | error puntoYcoma {console.log("Error sintáctico en la línea: "+(this._$.first_line)+" en la columna: "+(this._$.first_column));}
;

LISTA_VARIABLES: 
                LISTA_VARIABLES coma identificador { $1.push($3); $$ = $1; }
                |   identificador { $$ = [$1]; }
;

DECLARACION_VECT: 
                TIPO identificador corcheteAbre corcheteCierra igual new TIPO corcheteAbre EXPRESION corcheteCierra puntoYcoma
                |       TIPO identificador corcheteAbre corcheteCierra corcheteAbre corcheteCierra igual new TIPO corcheteAbre EXPRESION corcheteCierra corcheteAbre EXPRESION corcheteCierra puntoYcoma
                |       TIPO identificador corcheteAbre corcheteCierra igual corcheteAbre LISTA_VALORES corcheteCierra puntoYcoma
;

LISTA_VALORES:
                LISTA_VALORES coma EXPRESION { $1.push($3); $$ = $1; }
                | EXPRESION { $$ = [$1]; }
;

INSTRUCCIONES:
        INSTRUCCIONES INSTRUCCION { $1.push($2); $$ = $1; }
        | INSTRUCCION { $$ = [$1]; }
        | error puntoYcoma {console.log("Error sintáctico en la línea: "+(this._$.first_line)+" en la columna: "+(this._$.first_column));}
;

INSTRUCCION: 
        DECLARACION_VAR puntoYcoma{ $$ = $1; }
        |       DECLARACION_VECT {}
        |       FOR { $$ = $1; }
        |       WHILE { $$ = $1; }
        |       DO_WHILE { $$ = $1; }
        |       IF { $$ = $1; }
        |       SWITCH { $$ = $1; }
        |       SENTENCIA_TRANSFERENCIA { $$ = $1;}
        |       ASIGNACION puntoYcoma { $$ = $1; }
        |       INCREMENTO puntoYcoma{ $$ = $1; }
        |       DECREMENTO puntoYcoma{ $$ = $1; }
        |       LLAMADA puntoYcoma{ $$ = $1; }
        |       PRINT { $$ = $1; }
        |       PRINTLN { $$ = $1; } 
        |       error puntoYcoma {
                        console.log("Error sintáctico en la línea: "+(this._$.first_line)+" en la columna: "+(this._$.first_column));
                        }
        |       { $$ = null;}
;       

FOR: for parentesisAbre FOR_DECLARACION puntoYcoma EXPRESION puntoYcoma FOR_ITERADOR parentesisCierra BLOQUE { $$ = new For($3, $5, $7, $9, @1.first_line, @1.first_column); };

FOR_DECLARACION:
                DECLARACION_VAR { $$ = $1; }
                |       ASIGNACION { $$ = $1; }
;

FOR_ITERADOR: 
                ASIGNACION { $$ = $1; }
                |       INCREMENTO { $$ = $1; }
                |       DECREMENTO { $$ = $1; }
;

WHILE: while parentesisAbre EXPRESION parentesisCierra BLOQUE { $$ = new While($3, $5, @1.first_line, @1.first_column); } ;


DO_WHILE: do BLOQUE while parentesisAbre EXPRESION parentesisCierra puntoYcoma { $$ = new Do_While($2, $5, @1.first_line, @1.first_column); };


IF: if  parentesisAbre EXPRESION parentesisCierra BLOQUE CONTROL_ELSE { $$ = new If($3, $5, $6, @1.first_line, @1.first_column); };

CONTROL_ELSE:
        else BLOQUE { $$ = $2; }
        |       else IF { $$ = $2; }
        |       { $$ = null; }
;

SWITCH: switch parentesisAbre EXPRESION parentesisCierra llaveAbre CASELIST DEFAULT llaveCierra { $$ = new Switch($3, $6, $7, @1.first_line, @1.first_column); };

CASELIST: 
        CASELIST case EXPRESION dosPuntos INSTRUCCIONES { $1.push(new Case($3, $5, false, @1.first_line, @1.first_column, $1.length)); $$ = $1; }
        |       CASELIST case EXPRESION dosPuntos INSTRUCCIONES break puntoYcoma { $1.push(new Case($3, $5, true, @1.first_line, @1.first_column, $1.length)); $$ = $1; }
        |       case EXPRESION dosPuntos INSTRUCCIONES { $$ = [new Case($2, $4, false, @1.first_line, @1.first_column, 0)]; }
        |       case EXPRESION dosPuntos INSTRUCCIONES  break puntoYcoma{ $$ = [new Case($2, $4, true, @1.first_line, @1.first_column, 0)]; }
        |       {$$ = null;}
;

DEFAULT: 
        default dosPuntos INSTRUCCIONES break puntoYcoma { $$ = new Default($3, true, @1.first_line, @1.first_column); }
        |       default dosPuntos INSTRUCCIONES { $$ = new Default($3, false, @1.first_line, @1.first_column); }
        |       { $$ = null; }
;

ASIGNACION: identificador igual EXPRESION { $$ = new Asignacion($1, $3, @1.first_line, @1.first_column); };
INCREMENTO: identificador incremento { $$ = new Incremento_Ins($1, @1.first_line, @1.first_column); };
DECREMENTO: identificador decremento { $$ = new Decremento_Ins($1, @1.first_line, @1.first_column); };
LLAMADA: identificador parentesisAbre LISTA_VALORES parentesisCierra { $$ = new Llamada($1, $3, @1.first_line, @1.first_column); }
        |       identificador parentesisAbre parentesisCierra { $$ = new Llamada($1, new Array(), @1.first_line, @1.first_column); }
;
PRINT: print parentesisAbre EXPRESION parentesisCierra puntoYcoma { $$ = new Print($3, @1.first_line, @1.first_column); };
PRINTLN:println parentesisAbre EXPRESION parentesisCierra puntoYcoma { $$ = new Println($3, @1.first_line, @1.first_column); };

EXPRESION: 
        /*Operaciones aritmeticas*/
        EXPRESION mas EXPRESION { $$ = new Suma($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION menos EXPRESION { $$ = new Resta($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION multiplicacion EXPRESION { $$ = new Multiplicacion($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION division EXPRESION { $$ = new Division($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION exponente EXPRESION { $$ = new Potencia($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION modulo EXPRESION { $$ = new Modulo($1, $3, @1.first_line, @1.first_column); }
        |       menos EXPRESION %prec umenos { $$ = new Negado($2, @1.first_line, @1.first_column); }
        |       parentesisAbre EXPRESION parentesisCierra { $$ = $2;}
        /*Operaciones condicionales*/
        |       EXPRESION igualacion EXPRESION { $$ = new Igualacion($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION diferenciacion EXPRESION { $$ = new Diferenciacion($1, $3, @1.first_line, @1.first_column); } 
        |       EXPRESION menorQue EXPRESION { $$ = new Menor_Que($1, $3, @1.first_line, @1.first_column);}
        |       EXPRESION mayorQue EXPRESION { $$ = new Mayor_Que($1, $3, @1.first_line, @1.first_column);}
        |       EXPRESION mayorIgualQue EXPRESION { $$ = new Mayor_Igual_Que($1, $3, @1.first_line, @1.first_column);}
        |       EXPRESION menorIgualQue EXPRESION { $$ = new Menor_Igual_Que($1, $3, @1.first_line, @1.first_column); }
        /*Operaciones lógicas*/
        |       EXPRESION or EXPRESION { $$ = new Or($1, $3, @1.first_line, @1.first_column); }
        |       EXPRESION and EXPRESION { $$ = new And($1, $3, @1.first_line, @1.first_column); }
        |       not EXPRESION { $$ = new Not($2, @1.first_line, @1.first_column); }
        /*LLamada de función que devuelve un valor*/
        |       LLAMADA { $$ = $1; }
        /*Casteos*/
        |       parentesisAbre TIPO parentesisCierra EXPRESION { $$ = new Casteo($2, $4, @1.first_line, @1.first_column);} 
        /*Funciones reservadas del lenguaje*/
        |       toLower parentesisAbre EXPRESION parentesisCierra { $$ = new toLower($3, @1.first_line, @1.first_column); }
        |       toUpper parentesisAbre EXPRESION parentesisCierra { $$ = new toUpper($3, @1.first_line, @1.first_column); }
        |       round parentesisAbre EXPRESION parentesisCierra { $$ = new Round($3, @1.first_line, @1.first_column); }
        |       length parentesisAbre EXPRESION parentesisCierra { $$ = new Length($3, @1.first_line, @1.first_column); }
        |       TypeOf parentesisAbre EXPRESION parentesisCierra { $$ = new TypeOf($3, @1.first_line, @1.first_column); }
        |       to_String parentesisAbre EXPRESION parentesisCierra { $$ = new ToString($3, @1.first_line, @1.first_column); }
        |       toCharArray parentesisAbre EXPRESION parentesisCierra {}
        /*Valores que pueden estar en las expresiones*/
        |       cadena { $$ = new Literal($1, Tipo.STRING, @1.first_line, @1.first_column); }
        |       entero { $$ = new Literal(parseInt($1), Tipo.INT, @1.first_line, @1.first_column); }
        |       decimal { $$ = new Literal(Number($1), Tipo.DOUBLE, @1.first_line, @1.first_column); }
        |       caracter { $$ = new Literal($1, Tipo.CHAR, @1.first_line, @1.first_column); }
        |       true { $$ = new Literal($1, Tipo.BOOLEAN, @1.first_line, @1.first_column); }
        |       false { $$ = new Literal($1, Tipo.BOOLEAN, @1.first_line, @1.first_column); }
        |       identificador { $$ = new Identificador($1, @1.first_line, @1.first_column);}
        /*recordar que estos van porque se pueden asignar a una variable esto sin afectar a la variable que se incrementa o decrementa EJEM: int a = 10; int b = a++; */
        |       EXPRESION incremento { $$ = new Incremento_Exp($1, @1.first_line, @1.first_column); }
        |       EXPRESION decremento { $$ = new Decremento_Exp($1, @1.first_line, @1.first_column); }
        |       error puntoYcoma {
        console.log("Error sintáctico en la línea: "+(this._$.first_line)+" en la columna: "+(this._$.first_column));
        }
;

BLOQUE
    : llaveAbre INSTRUCCIONES llaveCierra { $$ = new Bloque($2, @1.first_line, @1.first_column); }
    | llaveAbre              llaveCierra { $$ = new Bloque(new Array(), @1.first_line, @1.first_column); }
;

SENTENCIA_TRANSFERENCIA:
                        break puntoYcoma { $$ = new Break(@1.first_line, @1.first_column); } 
                        |       continue puntoYcoma { $$ = new Continue(@1.first_line, @1.first_column); }
                        |       return EXPRESION puntoYcoma { $$ = new Return($2, @1.first_line, @1.first_column); }
                        |       return puntoYcoma { $$ = new Return(null, @1.first_line, @1.first_column); }
;

TIPO: 
    int { $$ = Tipo.INT;}
    |   double { $$ = Tipo.DOUBLE; }
    |   boolean { $$ = Tipo.BOOLEAN; }
    |   char { $$ = Tipo.CHAR; }
    |   string { $$ = Tipo.STRING; }
;