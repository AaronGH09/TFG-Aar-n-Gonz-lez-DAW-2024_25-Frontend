import React, { useContext, useState, useEffect } from 'react';
import { ContextPictos } from '../context/PictosProvider';
import { BotonesExportacion } from '../components/BotonesExportacion';
import { Contadores } from './Contadores';

// Componente ContenedorJuego es donde se realizada todo el juego interactivo
export const ContenedorJuego = () => {
  // Obtenemos los pictogframas del contexto
  const { pictogramas, pictogramasRef } = useContext(ContextPictos);
  // Variables locales para el control del juego
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [pictogramasDisponibles, setPictogramasDisponibles] = useState([]);
  const [palabrasDisponibles, setPalabrasDisponibles] = useState([]);
  const [emparejamientos, setEmparejamientos] = useState([]);

  useEffect(() => { // Usamos use efect para que cuando se actualicen los pictogramas tambien los hagan las variables locales
    setAciertos(0);
    setIntentos(0);
    setEmparejamientos([]);
    if (pictogramas.length > 0) {
      const pictogramasValidos = pictogramas.filter(p => p.id !== null); // Se filtran los pictogramas que tengan ids y luego se asignan a sus variables
      setPictogramasDisponibles(pictogramasValidos);

      const palabrasConPosicion = pictogramasValidos.map(p => ({ // Para posteriormente evitar que si hay palabras iguales se borren todas
        palabra: p.palabra,
        posicion: p.posicion,
        identificador: `${p.palabra}-${p.posicion}` // Añadimos un identificador único
      }));

      console.log('Palabras con posición:', palabrasConPosicion);
      setPalabrasDisponibles(palabrasConPosicion);
    }
  }, [pictogramas]);

  const handleDragStart = (e, id, palabra, posicion) => { // Funcion para guardar los datos del pictograma cuando inicia el arrastre
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("palabra", palabra);
    e.dataTransfer.setData("posicion", posicion);
  }

  const handleDragOver = (e) => { // Funcion para permitir soltar un elemento dragable en un sitio predeterminado
    e.preventDefault();
  }

  // Funcion que se encarga de la comprobacion de si el pictograma coresponde a la palabra y su posteriro resultado
  const handleDrop = (e, palabra2, posicion2) => {
    e.preventDefault();

    const id = parseInt(e.dataTransfer.getData("id"));
    const palabra = e.dataTransfer.getData("palabra");
    const posicion = parseInt(e.dataTransfer.getData("posicion"));
    const identificador = `${palabra}-${posicion}`;

    setIntentos(intentos => intentos + 1);

    // Si es correcto aumenta aciertos en uno, cambia el texto del mensaje, guarda el emparejamiento y lo borra del juego
    if (palabra === palabra2 && posicion === posicion2) {
      setAciertos(aciertos => aciertos + 1);
      setMensaje('🎊🎉🎉¡Correcto! ¡Buen trabajo!🎉🎉🎊');
      setEmparejamientos(emparejamientos => [...emparejamientos, { id: id, palabra: palabra, posicion: posicion }]);
      // Filtra por palabra y posicion para quitar el pictograma acertado
      setPictogramasDisponibles(pictogramas => {
        const nuevosPictogramas = pictogramas.filter(pictograma =>
          !(pictograma.palabra === palabra && pictograma.posicion === posicion)
        );
        return nuevosPictogramas;
      });
      // Filtra la palabra acertada por palabra y posicion
      setPalabrasDisponibles(palabras => {
        const identificadorpalabra = `${palabra2}-${posicion2}`;
        const nuevasPalabras = palabras.filter(palabra => palabra.identificador !== identificadorpalabra);
        return nuevasPalabras;
      });
    }
    else {
      setMensaje('¡Inténtalo de nuevo! ¡Tú puedes!');
    }

  }

  return (
    <>
      <div className="juego-container">
        {/* Componente que muestra los contadores */}
        <Contadores aciertos={aciertos} intentos={intentos} />
        {/* Mensaje de feedback */}
        {mensaje && (
          <div className={`mensaje mensaje-${mensaje.includes('Correcto') ? 'correcto' : 'intento'}`}>
            {mensaje}
          </div>
        )}

        <div className="juego-columnas">
          {/* Columna de pictogramas */}
          <div className="pictogramas-columna">
            <h2>Pictogramas</h2>
            <div className="pictogramas-div">

              {pictogramasDisponibles.map((pictograma) => (
                <div
                  key={pictograma.identificador}
                  draggable // Indicamos que es dragable
                  onDragStart={(e) => handleDragStart(e, pictograma.id, pictograma.palabra, pictograma.posicion)}
                  className='pictograma'
                >
                  <img
                    src={`https://static.arasaac.org/pictograms/${pictograma.id}/${pictograma.id}_500.png`}
                    alt={pictograma.palabra}
                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                  />
                </div>
              ))}

            </div>
          </div>
          {/* Columna de palabras */}
          <div className="palabras-columna">
            <h2>Palabras</h2>
            <div className="palabras-div">

              {palabrasDisponibles.map((palabra) => (
                <div
                  key={`palabra-${palabra.palabra}-${palabra.posicion}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, palabra.palabra, palabra.posicion)}
                  className='palabra'
                >
                  {palabra.palabra.toUpperCase()}
                </div>
              ))}

            </div>
          </div>
        </div>
        {/* Columna de emparejamientos correctos */}
        <div className="emparejamientos-columna" ref={pictogramasRef}>
          <h2>Emparejamientos Correctos</h2>
          <div className="emparejamientos-div">

            {emparejamientos.map((emparejamiento, index) => (
              <div
                key={`emparejamiento-${emparejamiento.id}-${index}`}
                className='emparejamiento'
              >
                <img
                  src={`https://static.arasaac.org/pictograms/${emparejamiento.id}/${emparejamiento.id}_500.png`}
                  alt={emparejamiento.palabra}
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
                {emparejamiento.palabra.toUpperCase()}
              </div>
            ))}

          </div>
        </div>
        {(() => { 
          if (emparejamientos.length > 0) {
            return <BotonesExportacion />;
          }
        })()}
      </div>
    </>
  )
}