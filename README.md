# Web compiler · OLC1

A university compiler project built with TypeScript, Jison, Node.js, and Angular. It demonstrates lexical, syntactic, and semantic analysis of a custom language through a web interface.

## Explore the implementation

- [Server](server) contains the Express application and the language implementation.
- [Jison grammar](server/src/analizadores/gramatica.jison) defines how source text is parsed.
- [Angular client](cliente) contains the browser interface.
- [Sample source program](recursividad.cst) exercises recursion.
- [Project documentation](Documentaci%C3%B3n) contains the original course materials.

The project uses Angular 13 and TypeScript 4.6. The [client scripts](cliente/package.json) and [server scripts](server/package.json) retain the original development commands.
