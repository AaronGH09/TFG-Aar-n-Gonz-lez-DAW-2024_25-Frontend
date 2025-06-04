import React, { createContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

// Creamos el contexto para poder pasar datos y funciones de forma global
export const ContextPictos = createContext();

export const PictosProvider = ({ children }) => {
    /*
    Ruta de palabras para sacar id: https://api.arasaac.org/v1/pictograms/es/search/${(word)}
    Ruta de imagen para sacar el picto: https://static.arasaac.org/pictograms/{id}/{id}_500.png
    Ruta de ids atraves del Backend http://localhost:8080/api/arasaac/ids?palabra=gato
    */

    /* Estados, referencias y url para realizar la peticion al backend*/
    const [frase, setFrase] = useState('');
    const [pictogramas, setPictogramas] = useState([]);
    const pictogramasRef = useRef(null); //Se usa para hacer referencia a alguna parte de html para poder plasmarla como imagen o pdf
    const urlWord = "http://localhost:8081/api/arasaac/ids?palabra=";

    /* Esta función se encarga de dividir la frase recibida en palabras y realizar una iteración para consultar al backend por cada una de ellas. 
    Por cada palabra, se hace una petición a la API para obtener los pictogramas asociados a esta. En caso de que no haya resultados o haya ocurrido un error, 
    se guardará solo la palabra, y el resto de los datos se establecerán como nulos o vacíos. Tambien tiene un identificador especial por si hay varias palabras iguales */
    const buscarPictogramas = async (texto) => {
        setPictogramas([]); // Limpiamos los pictogramas antes de la búsqueda
        const palabras = texto.split(/[\s,]+/).filter(palabra => palabra.trim() !== ''); // Separamos la frase por espacios y comas y filtra espacios
        const nuevosPictogramas = [];
        const contadorPalabras = {}; // Para llevar un conteo de cada palabra

        for (let i = 0; i < palabras.length; i++) { // Iteramos sobre cada palabra
            const palabra = palabras[i];
            // Incrementamos el contador de la palabra por cada palabra igual
            contadorPalabras[palabra] = (contadorPalabras[palabra] || 0) + 1;

            try {
                const respuesta = await fetch(`${urlWord}${palabra}`); // Realizamos la petición al backend
                const resultado = await respuesta.json(); // Resultado de la peticion

                if (resultado && resultado.length > 0) { //Si hay resultados, guardamos la palabra y sus pictogramas, ademas de un indice y el primer id y la posicion y identificador
                    nuevosPictogramas.push({
                        palabra,
                        id: resultado[0],
                        alternativas: resultado,
                        indice: 0,
                        posicion: i,
                        identificador: `${palabra}-${i}-${contadorPalabras[palabra]}`
                    });
                } else { // Si no hay resultados, guardamos la palabra y el resto como valores vacíos
                    nuevosPictogramas.push({
                        palabra,
                        id: null,
                        alternativas: [],
                        indice: 0,
                        posicion: i,
                        identificador: `${palabra}-${i}-${contadorPalabras[palabra]}`
                    });
                }
            } catch (error) { // En caso de error, se guarda como si no hubiera resultados
                console.error('Error al buscar pictograma:', error);
                nuevosPictogramas.push({
                    palabra,
                    id: null,
                    alternativas: [],
                    indice: 0,
                    posicion: i,
                    identificador: `${palabra}-${i}-${contadorPalabras[palabra]}`
                });
            }
        }

        setPictogramas(nuevosPictogramas); // Actualizamos el estado con los resultados
    };

    /* Esta función permite cambiar el pictograma seleccionado para una palabra. Recibe dos parámetros, la posicion cuyo pictograma se desea cambiar y un número que indica 
    si se debe avanzar (+1) o retroceder (-1) en la lista de alternativas. Posteriormente busca en la la lista de pictogramas y, si encuentra la palabra indicada: 
    Calcula el nuevo índice, si el índice es menor que 0 se posiciona en el ultimo elemento , si el índice supera el máximo se posiciona en el primero y luego actualiza
    el pictograma con el nuevo índice y su correspondiente ID */
    const cambiarPictograma = (operacion, posicion) => {
        setPictogramas(pictogramas =>
            pictogramas.map(picto => {
                if (picto.posicion !== posicion) return picto; // Aqui recoremos los pictogramas en busca del pictograma deseado

                const max = picto.alternativas.length; //Sacamos el indice maximo
                let nuevoIndice = picto.indice + operacion;  //Calculamos el nuevo indice

                if (nuevoIndice < 0) nuevoIndice = max - 1; // Comprobamos si el indice es menor que 0 lo ponemos en el ultimo elemento
                if (nuevoIndice >= max) nuevoIndice = 0; // Comprobamos si el indice es mayor que el maximo lo ponemos en el primer elemento

                return { //Guardamos los nuevos valores del pictograma
                    ...picto,
                    indice: nuevoIndice,
                    id: picto.alternativas[nuevoIndice]
                };
            })
        );
    };

    /*Esta función permite exportar el contenido HTML referenciado por `pictogramasRef` como una imagen PNG.*/
    const exportarComoImagen = async () => {
        if (!pictogramasRef.current) return; // Verifica si existe la referencia

        try {
            const canvas = await html2canvas(pictogramasRef.current, {  //Atraves de html2canvas capturamos el contenido html deseado como canvas
                scale: 1, // Este valor mantiene la escala orginal del contenido
                useCORS: true, // Esto permite cargar imagenes externas
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a'); // Crea un enlace para la descarga
            link.download = 'pictogramas.png'; // Nombre del archivo descargado
            link.href = canvas.toDataURL('image/png'); // Indicamos que el link hace referencia al elemento canvas y le indicamos el formato como png
            link.click(); // Simula el clic para descargar la imagen
        } catch (error) {
            console.error('Error al exportar como imagen:', error);
        }
    };

    /*Esta función permite exportar el contenido HTML referenciado por `pictogramasRef` como una imagen PDF. 
    Primero pasandola a PNG atraves de html2canvas y luego añadiendo la imagen a un PDF creado por jsPDF */
    const exportarComoPDF = async () => {
        if (!pictogramasRef.current) return;

        try {
            const canvas = await html2canvas(pictogramasRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'mm', 'a4'); // Creamos el PDF en horizontal, en mm y un tamaño de a4

            const pdfWidth = pdf.internal.pageSize.getWidth(); // Captura el ancho de la pagina en mm
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Captura el alto de la pagina en mm

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);// Añade la imagen al pdf como PNG, en las cordenadas 0,0 y con las dimensiones anteriores
            pdf.save('pictogramas.pdf'); // Inicia la descarga del PDF
        } catch (error) {
            console.error('Error al exportar como PDF:', error);
        }
    };

    return (
        <ContextPictos.Provider value={{ frase, setFrase, pictogramas, pictogramasRef, buscarPictogramas, cambiarPictograma, exportarComoImagen, exportarComoPDF }}>
            {children}
        </ContextPictos.Provider>
    )
}