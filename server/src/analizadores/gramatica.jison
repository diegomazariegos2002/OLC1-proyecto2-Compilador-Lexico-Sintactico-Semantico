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
.                     { console.log("Error léxico") }

/lex //fin analizador léxico

/* Comienzo analizador sintáctico */
// Importaciones
%{
	//Importanción de instrucciones
	const { Print } = require('../instrucciones/Print.ts');
        const { Println } = require('../instrucciones/Println.ts');
        const { Declaracion_Var } = require('../instrucciones/Declaracion_Var.ts');
        const { Asignacion } = require('../instrucciones/Asignacion.ts');
        //Importación de expresiones
        const { Literal } = require('../expresiones/Literal.ts');
        const { Identificador } = require('../expresiones/Identificador.ts');
        const { Casteo } = require('../expresiones/Casteo.ts');
                //expresiones aritméticas
        const { Suma } = require('../expresiones/aritmetica/Suma.ts');
        const { Resta } = require('../expresiones/aritmetica/Resta.ts');
        const { Multiplicacion } = require('../expresiones/aritmetica/Multiplicacion.ts');
        const { Division } = require('../expresiones/aritmetica/Division.ts');
        const { Potencia } = require('../expresiones/aritmetica/Potencia.ts');
        const { Modulo } = require('../expresiones/aritmetica/Modulo.ts');
        const { Negado } = require('../expresiones/aritmetica/Negado.ts');
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
        FUNCION {}
        |   METODO {}
        |   RUN {}
        |   DECLARACION_VAR {}
        |   DECLARACION_VECT {}
        |   INSTRUCCION { $$ = $1; }
;

FUNCION: 
        identificador parentesisAbre parentesisCierra dosPuntos TIPO parentesisAbre parentesisCierra {}
        |   identificador parentesisAbre parentesisCierra dosPuntos TIPO parentesisAbre INSTRUCCIONES parentesisCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos TIPO parentesisAbre parentesisCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos TIPO parentesisAbre INSTRUCCIONES parentesisCierra {}
;

METODO: 
        identificador parentesisAbre parentesisCierra dosPuntos void llaveAbre llaveCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos void llaveAbre llaveCierra {}
        |   identificador parentesisAbre parentesisCierra dosPuntos void llaveAbre INSTRUCCIONES llaveCierra {}
        |   identificador parentesisAbre LISTAPARAMETROS parentesisCierra dosPuntos void llaveAbre INSTRUCCIONES llaveCierra {}
;

RUN: 
    run identificador parentesisAbre parentesisCierra puntoYcoma {}
    |   run identificador parentesisAbre LISTAPARAMETROS parentesisCierra puntoYcoma {}
;

DECLARACION_VAR: 
            TIPO LISTA_VARIABLES puntoYcoma { $$ = new Declaracion_Var($2, null, $1, @1.first_line, @1.first_column); }
            |   TIPO LISTA_VARIABLES igual EXPRESION puntoYcoma { $$ = new Declaracion_Var($2, $4, $1, @1.first_line, @1.first_column); }
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
                LISTA_VALORES coma VALOR {}
                | VALOR {}
;

INSTRUCCIONES:
        INSTRUCCIONES INSTRUCCION {}
        | INSTRUCCION {}
;

INSTRUCCION: 
        DECLARACION_VAR {}
        |       DECLARACION_VECT {}
        |       FOR {}
        |       WHILE {}
        |       DO_WHILE {}
        |       IF {}
        |       SWITCH {}
        |       ASIGNACION { $$ = $1; }
        |       INCREMENTO {}
        |       DECREMENTO {}
        |       LLAMADA {}
        |       PRINT {$$ = $1;}
        |       PRINTLN {}
        |       error puntoYcoma {
                        console.log("Error sintáctico en la línea: "+(yylineno + 1));
                        var consola = Consola.getInstance();
                        const error = new Excepcion("Error sintáctico", "El caracter "+ (this.terminals_[symbol] || symbol)+" no se esperaba en esta posición.", this._$.first_line, this._$.first_column+1);
                        consola.set_Error(error);
        }
;

FOR:;
WHILE:;
DO_WHILE:;
IF:;
SWITCH:;
ASIGNACION: identificador igual EXPRESION puntoYcoma { $$ = new Asignacion($1, $3, @1.first_line, @1.first_column); };
INCREMENTO: identificador incremento puntoYcoma;
DECREMENTO: identificador decremento puntoYcoma;
LLAMADA:;
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
        |       identificador parentesisAbre LISTA_VALORES parentesisCierra puntoYcoma {}
        /*Casteos*/
        |       parentesisAbre TIPO parentesisCierra EXPRESION { $$ = new Casteo($2, $4, @1.first_line, @1.first_column);} 
        /*Funciones reservadas del lenguaje*/
        |       toLower parentesisAbre EXPRESION parentesisCierra {}
        |       toUpper parentesisAbre EXPRESION parentesisCierra {}
        |       round parentesisAbre EXPRESION parentesisCierra {}
        |       length parentesisAbre EXPRESION parentesisCierra {}
        |       TypeOf parentesisAbre EXPRESION parentesisCierra {}
        |       to_String parentesisAbre EXPRESION parentesisCierra { $$ = new ToString($3, @1.first_line, @1.first_column); }
        |       toCharArray parentesisAbre EXPRESION parentesisCierra {}
        /*Valores que pueden estar en las expresiones*/
        |       cadena { $$ = new Literal($1, Tipo.STRING, @1.first_line, @1.first_column); }
        |       entero { $$ = new Literal($1, Tipo.INT, @1.first_line, @1.first_column); }
        |       decimal { $$ = new Literal($1, Tipo.DOUBLE, @1.first_line, @1.first_column); }
        |       caracter { $$ = new Literal($1, Tipo.CHAR, @1.first_line, @1.first_column); }
        |       true { $$ = new Literal($1, Tipo.BOOLEAN, @1.first_line, @1.first_column); }
        |       false { $$ = new Literal($1, Tipo.BOOLEAN, @1.first_line, @1.first_column); }
        |       identificador { $$ = new Identificador($1, @1.first_line, @1.first_column);}
        /*recordar que estos van porque se pueden asignar a una variable esto sin afectar a la variable que se incrementa o decrementa EJEM: int a = 10; int b = a++; */
        |       EXPRESION incremento {}
        |       EXPRESION decremento {}
        |       error puntoYcoma {
                        console.log("Error sintáctico en la línea: "+(yylineno + 1));
                        var consola = Consola.getInstance();
                        const error = new Excepcion("Error sintáctico", "El caracter "+ (this.terminals_[symbol] || symbol)+" no se esperaba en esta posición.", this._$.first_line, this._$.first_column+1);
                        consola.set_Error(error);
        }
;

VALOR: EXPRESION {} ;

TIPO: 
    int { $$ = Tipo.INT;}
    |   double { $$ = Tipo.DOUBLE; }
    |   boolean { $$ = Tipo.BOOLEAN; }
    |   char { $$ = Tipo.CHAR; }
    |   string { $$ = Tipo.STRING; }
;