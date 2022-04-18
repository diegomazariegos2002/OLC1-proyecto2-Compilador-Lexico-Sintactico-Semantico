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
"Tipoof"                return 'TipoOf'
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
"<" /*menorQue*/        return 'menorQue'
"<=" /*menorIgualQue*/  return 'menorIgualQue'
">" /*mayorQue*/        return 'mayorQue'    
">=" /*mayorIgualQue*/  return 'mayorIgualQue'
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
        const { Suma } = require('../expresiones/aritmetica/Suma.ts');
        const { Resta } = require('../expresiones/aritmetica/Resta.ts');
        const { Multiplicacion } = require('../expresiones/aritmetica/Multiplicacion.ts');
        const { Division } = require('../expresiones/aritmetica/Division.ts');
        //Importación de herramientas auxiliares
        const { Consola } = require('../consola_singleton/Consola.ts');
        const { Tipo } = require('../abstracto/Retorno.ts');
        const { Excepcion } = require('../errores/Excepcion.ts');
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
        | error { console.error('Este es un error sintáctico') }
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
        |       error ';' {
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
        |       EXPRESION exponente EXPRESION {}
        |       EXPRESION modulo EXPRESION {}
        |       menos EXPRESION %prec umenos {}
        |       parentesisAbre EXPRESION parentesisCierra {}
        /*Operaciones condicionales*/
        |       EXPRESION igualacion EXPRESION {}
        |       EXPRESION diferenciacion EXPRESION {}
        |       EXPRESION menorQue EXPRESION {}
        |       EXPRESION mayorQue EXPRESION {}
        |       EXPRESION mayorIgualQue EXPRESION {}
        |       EXPRESION menorIgualQue EXPRESION {}
        |       not EXPRESION {}
        /*LLamada de función que devuelve un valor*/
        |       identificador parentesisAbre LISTA_VALORES parentesisCierra puntoYcoma {}
        /*Casteos*/
        |       parentesisAbre TIPO parentesisCierra EXPRESION {} 
        /*Funciones reservadas del lenguaje*/
        |       toLower parentesisAbre EXPRESION parentesisCierra {}
        |       toUpper parentesisAbre EXPRESION parentesisCierra {}
        |       round parentesisAbre EXPRESION parentesisCierra {}
        |       length parentesisAbre EXPRESION parentesisCierra {}
        |       TipoOf parentesisAbre EXPRESION parentesisCierra {}
        |       tostring parentesisAbre EXPRESION parentesisCierra {}
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
;

VALOR: EXPRESION {} ;

TIPO: 
    int { $$ = Tipo.INT;}
    |   double { $$ = Tipo.DOUBLE; }
    |   boolean { $$ = Tipo.BOOLEAN; }
    |   char { $$ = Tipo.CHAR; }
    |   string { $$ = Tipo.STRING; }
;