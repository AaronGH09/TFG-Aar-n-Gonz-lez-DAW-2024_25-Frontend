import React, { useContext, useState } from 'react';
import { ContextPictos } from '../context/PictosProvider';
import { Header } from '../components/Header';
import { Buscador } from '../components/Buscador';
import { Pictograma } from '../components/Pictograma';
import { BotonesExportacion } from '../components/BotonesExportacion';
import { Footer } from '../components/Footer';
import '../index.css'

export const Inicio = () => {
  // Se accede al contexto para obtener los pictogramas y indicar la referencia al contenedor
  const { pictogramas, pictogramasRef } = useContext(ContextPictos); 

  return (
    <>
      <div className="page-container">
        <Header /> {/* Componente del encabezado de la página */}
        
        <main className="main-content">
          <h1 className="main-title">Conversor de Frases a Pictogramas</h1>
    
           <Buscador /> {/* Componente del búscador de pictogramas */}

          <div ref={pictogramasRef} className="pictogram-grid"> {/* Contenedor de pictogramas, con la referencia para la exportación como PDF o PNG */}
            {pictogramas.map((picto) => (  /* Componte pictograma uno por palabra */
              <Pictograma key={picto.identificador} picto={picto}/>
            ))}
          </div>

          {(() => { /* Condicional para que en caso de que haya pictogramas, se muestran los botones de exportación */
            if (pictogramas.length > 0) {
              return <BotonesExportacion />;
            }
          })()}
        </main>

        <Footer /> {/* Componente pie de página */}
      </div>
    </>
  )
}