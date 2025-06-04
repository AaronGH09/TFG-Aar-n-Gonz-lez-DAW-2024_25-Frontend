import React, { useContext, useState, useEffect } from 'react';

// Componente Contadores que recibe como props los aciertos e intentos y tiene la opcion de bloqueo
export const Contadores = ({ aciertos, intentos }) => {
    const [bloqueo, setBloqueo] = useState(false); // Estado para saber si está en modo de bloqueo (pantalla completa)
    const [countbloqueo, setCountbloqueo] = useState(0);  // Contador de intentos para desbloquear (se requieren 3 clics)
    const [mensajebloqueo, setMensajebloqueo] = useState('🔒 Bloquear'); // Texto que se muestra en el botón de bloqueo/desbloqueo 

  const Bloquear = () => { // Función que activa el modo de pantalla completa
    const pagina = document.documentElement;
    if (pagina.requestFullscreen) pagina.requestFullscreen();
  };

  const Desbloquear = () => { // Función que sale del modo de pantalla completa
    if (document.fullscreenElement ) document.exitFullscreen();
  };

  const iniciarBloqueo = () => { // Función que se encarga de iniciar el bloqueo o desbloqueo
    /* Si no está bloqueado, se activa el modo pantalla completa, cambiando tanmbien el 
    estado de bloqueo, el mensaje y poniendo el contador a 0 */
    if (!bloqueo) {
      Bloquear();
      setBloqueo(true);
      setMensajebloqueo('🔓 Desbloquear');
      setCountbloqueo(0);
    } else { // Si ya está bloqueado y se clickea, se incrementa el contador de desbloqueo
      const Count = countbloqueo + 1;
      setCountbloqueo(Count);
      /* Si se ha hecho clic 3 veces, se desbloquea cambiando tanmbien el estado de bloqueo, el mensaje y poniendo el contador a 0 */
      if (Count >= 3) {
        Desbloquear();
        setBloqueo(false);
        setMensajebloqueo('🔒 Bloquear');
        setCountbloqueo(0); 
      } else { // Si no muestra cuántos clics faltan para desbloquear
        setMensajebloqueo(`Pulsa ${3 - Count} más`);
      }
    }
  };
    return (
        <>
            <div className="contadores">
                {/* Número de aciertos */}
                <div className="contador">
                    <h3>Aciertos: {aciertos}</h3>
                </div>
                {/* Número de intentos */}
                <div className="contador">
                    <h3>Intentos: {intentos}</h3>
                </div>
                {/* Botón para bloquear/desbloquear con mensaje dinámico */}
                <button className="contador bloquear" onClick={iniciarBloqueo}>
                    {mensajebloqueo}
                </button>
            </div>
        </>
    )
}
