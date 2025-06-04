import React, { useContext } from 'react';
import { ContextPictos } from '../context/PictosProvider';

/* Componente BotonesExportacion, renderiza botones para exportar contenido como PNG o como PDF */
export const BotonesExportacion = () => {
    //Cogemos las funciones de exportacion de PDF y de PNG del contexto
    const { exportarComoImagen, exportarComoPDF } = useContext(ContextPictos);

    return (
        <div className="export-buttons">
            <button /* Botón para exportar como PNG con un onclick para llamar a la funcion exportarComoImagen */
                onClick={exportarComoImagen}
                className="export-button export-image"
            >
                Exportar como Imagen
            </button>
            <button /* Botón para exportar como PDF con un onclick para llamar a la funcion exportarComoPDF */
                onClick={exportarComoPDF}
                className="export-button export-pdf"
            >
                Exportar como PDF
            </button>
        </div>
    );
}; 