const getById = id => document.getElementById( id );
const getAll = sel => document.querySelectorAll( sel );

const getIO = () => ( {
    text: getAll( "#text" )[ 0 ]
        .value
        .normalize(),
    search: getAll( "#search" )[ 0 ]
        .value
        .normalize(),
    view: getAll( "#view" )[ 0 ]
} );

// Deja solo palabras, números y caracteres de puntuación correctos
const clean_string = ( text ) =>
    text
    .replace( /[\n\r\t]+/igm, " " ) // Transformar algunos separadores en espacios en blanco
    .replace( /[^a-zñáéíóú0-9 \.,;:()¿?¡!“”❝❞«»❛❜'‘’\-_]+/igm, "" ) // Solo letras, dígitos y puntuación
    .replace( /[ ]+/gm, " " ) // Eliminar espacios en blanco adicionales

const char_array = ( text ) =>
    clean_string( text )
    .replace( /[^a-zñáéíóú]+/igm, "" )  // dejar solo letras
    .split( "" ) // generar matriz
    .filter( ( w ) => ( w !== "" ) ) // eliminar elementos vacíos de la cadena

// TODO
const word_array = ( text ) =>
    text
    .replace( /[ ]+/g, " " )
    .replace( /^ /, "" )
    .replace( / $/, "" )
    .replace( /(\n)/g, " " )
    .split( " " )

const sentence_array = ( text ) =>
    clean_string( text )
    .replace( /([\.:;?!\n]+)/gm, "$1+" )
    .split( "+" )
    .filter( ( w ) => ( w !== "" ) ) // eliminar elementos vacíos de la cadena
    .map( ( s ) => ( s.replace( /^[ 0-9]+(.*$)/, "$1" ) ) ) // eliminar elementos vacíos de la cadena

const repetitions = ( ordered_array ) =>
    ordered_array
    .reduce(
        ( acc, el, i, a ) => {
            if ( i === 0 ) acc.push( {
                s: el,
                n: 1
            } );
            else if ( el === a[ i - 1 ] ) acc[ acc.length - 1 ].n++;
            else acc.push( {
                s: el,
                n: 1
            } );
            return acc;
        },
        []
    );

const count = () => {
    let {
        text,
        view
    } = getIO();

    let result = `Caracteres: ${char_array(text).length}\n`;
    result += `Palabras: ${word_array(text).length}\n`;
    result += `Frases: ${sentence_array(text).length}\n`;
    result += `Lineas: ${text.split("\n").length}\n`;

    view.innerHTML = result;
};

const letter_index = () => {
    let {
        text,
        view
    } = getIO();

    let ordered_letters =
        char_array( text )
        .map( el => el.toLowerCase() )
        .sort();

    let result =
        repetitions( ordered_letters )
        .map( el => `${el.s}: ${el.n}` )
        .join( "\n" );

    view.innerHTML = result;
};

// TODO
const word_index = () => {
    let {
        text,
        view
    } = getIO();

    let ordered_words =
        word_array( text )
        .map( el => el.toLowerCase() )
        .sort();

    let result =
        repetitions( ordered_words )
        .map( el => `${el.s}: ${el.n}` )
        .join( "\n" );

    view.innerHTML = result;
};

const sentence_index = () => {
    let {
        text,
        view
    } = getIO();

    let ordered_sentences =
        sentence_array( text )
        .map( el => el.toLowerCase() )
        .sort();
    let result =
        repetitions( ordered_sentences )
        .map( el => `${el.s}: ${el.n}` )
        .join( "\n" );

    view.innerHTML = result;
};

const search_letters = () => {
        let {
            text,
            view,
            search
        } = getIO();
        if ( search.length > 1 ) {
            let result = `'${ search }' no es una letra.`;
            view.innerHTML = result;
        } else {
            let ordered_letters =
                char_array( text )
                .map( el => el.toLowerCase() )
                .filter( el => el.includes( search.toLowerCase() ) )
                .sort();

            let result = `Hay ${ ordered_letters.length } ocurrencias de la letra '${ search }'.\n\n`

            result +=
                repetitions( ordered_letters )
                .map( el => `${ el.n } repeticiones de:  ${ el.s }` )
                .join( "\n" );

            view.innerHTML = result;
        }
    };

// TODO
const search_words = () => {
    let {
        text,
        view,
        search
    } = getIO();

    let ordered_words =
        word_array( text )
        .map( el => el.toLowerCase() )
        .filter( el => el.includes( search.toLowerCase() ) )
        .sort();

    let result = `Hay ${ordered_words.length} ocurrencias de la palabra '${search}'.\n\n`

    result +=
        repetitions( ordered_words )
        .map( el => `${el.n} repeticiones de:  ${el.s}` )
        .join( "\n" );

    view.innerHTML = result;
};

const search_sentences = () => {
    let {
        text,
        view,
        search
    } = getIO();

    let searched_sentences =
        sentence_array( text )
        .filter( el => el.includes( search ) )
        .sort()

    let result = `Hay ${searched_sentences.length} frases que contienen '${search}'.\n\n`

    result +=
        repetitions( searched_sentences )
        .map( el => `${el.n} repeticiones de:   ${el.s}` )
        .join( "\n" );

    view.innerHTML = result;
};

const vaciar = () => {
    document.getElementById( "text" ).value = '';
    document.getElementById( "search" ).value = '';
    document.getElementById( "view" ).innerHTML = '';
};


// ROUTER de eventos
document.addEventListener( 'click', ev => {
    if ( ev.target.matches( '.count' ) ) count();
    else if ( ev.target.matches( '.letter_index' ) ) letter_index();
    else if ( ev.target.matches( '.word_index' ) ) word_index();
    else if ( ev.target.matches( '.sentence_index' ) ) sentence_index();
    else if ( ev.target.matches( '.search_letters' ) ) search_letters();
    else if ( ev.target.matches( '.search_words' ) ) search_words();
    else if ( ev.target.matches( '.search_sentences' ) ) search_sentences();
} );