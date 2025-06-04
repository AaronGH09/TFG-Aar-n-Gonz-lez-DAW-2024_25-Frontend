import React, { useContext, useEffect, useState } from 'react';
import Buscadorsvg from '../assets/buscador.svg';
import { ContextPictos } from '../context/PictosProvider';

// Componente Buscador se encarga de recoger la frase ya sea de forma escrita o hablada
export const Buscador = () => {
    // Obtener valores y funciones del contexto
    const { frase, setFrase, buscarPictogramas } = useContext(ContextPictos);
    // Estados locales para controlar si se está escuchando y la instancia de reconocimiento de voz
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    // SpeechRecognition con compatibilidad con diferentes navegadores
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    useEffect(() => { // useEffect para inicializar el reconocimiento de voz al montar el componente
        if (SpeechRecognition) { // Verificar si el navegador soporta la API de reconocimiento de voz
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Esto evita el uso continuo por lo que coge una frase por vez
            recognition.interimResults = false; // Esto no muestra los resultados hasta que este todo
            recognition.lang = 'es-ES';

            recognition.onresult = (event) => { // Evento para cuando se obtiene un resultado
                const transcript = event.results[0][0].transcript; //Extrae la transcripcion
                setFrase(transcript); // Actualiza la frase en el contexto
                setIsListening(false); // Detiene el estado de escucha
            };

            recognition.onerror = (event) => { // Manejo de errores
                console.error('Error en el reconocimiento de voz:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => { // Evento para cuando termina el reconocimiento
                setIsListening(false);
            };

            setRecognition(recognition);
        }
    }, [setFrase]);

    const Listening = () => { // Función para iniciar o detener el reconocimiento de voz
        setFrase([]); // Limpiamos la frase que este puesta
        if (recognition) {
            if (isListening) { // La detiene si ya está escuchando
                recognition.stop();
            } else { // La inicia si no está escuchando
                recognition.start();
                setIsListening(true);
            }
        } else {
            alert('Tu navegador no soporta el reconocimiento de voz');
        }
    };

    const handleSubmit = (e) => { // Funcion para asignar la frase y iniciar la busqueda de pictogramas
        e.preventDefault();
        buscarPictogramas(frase);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
                <input
                    type="text"
                    value={frase}
                    onChange={(e) => setFrase(e.target.value)}  // Actualiza la frase al escribir
                    placeholder="Escribe una frase..."
                    className="search-input"
                />
                <button 
                    type="button"
                    onClick={Listening}  // Inicia/detiene el reconocimiento de voz
                    className="voice-button"
                    title={isListening ? 'Detener grabación' : 'Iniciar grabación'}
                >
                <img src={Buscadorsvg} alt="Buscador" />
                </button>
                <button 
                    type="submit"
                    className="search-button"
                >
                    Convertir
                </button>
            </div>
        </form>
    );
};