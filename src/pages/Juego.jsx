import React, { useContext, useState } from 'react';
import { Header } from '../components/Header';
import { Buscador } from '../components/Buscador';
import { ContenedorJuego } from '../components/ContenedorJuego';
import { Footer } from '../components/Footer';

export const Juego = () => {
  return (
    <>
          <div className="page-container">
            <Header />  {/* Componente del encabezado de la página */}
            
            <main className="main-content">
              <h1 className="main-title">Minijuego de unir Palabras y Pictogramas</h1>
              <Buscador /> {/* Componente del búscador de pictogramas */}
              <ContenedorJuego/> {/* Componente del contenedor del juego interactivo */}
            </main>
            <Footer /> {/* Componente pie de página */}
          </div>
    </>
  )
}
