/**
 * Essa RegEx significa que quero encontrar tudo que começa com ":" e depois dos ":", letras de 'a' a 'z' que podem
 * podem ser minúsculas ou letras de 'A' a 'Z' maiúsculas, e elas podem existir UMA OU MAIS vezes
 * O g no final indica que é uma RegEx global e não para no primeiro retorno positivo
 * Cada vez que coloca o parênteses dentro da RegEx é como se estivesse criando um subgrupo
 * Extensão VSCode: RegexPreviewer.
 */
export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;

    // Toda vez que fazemos uma RegEx com o parênteses em volta, nós criamos um grupo
    // O '?<$1>' vai pegar a regex routeParametersRegex para nomear cada grupo encontrado
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

    // Adicionando o '?' no final do parênteses, significa que essa parte da RegEx é opcional
    // Esse '?' é devido ao query parameter que vem na rota, separado com o '?'
    // O '$' no final significa que a RegEx precisa terminar com esse final, os seja, não pode conter mais nada depois disso
    // O '.' quer dizer "qualquer caractere" e o '*' significa para pegar tudo
    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex;
}