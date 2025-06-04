import React from 'react';

/* Componente Footer que muestra información sobre el proyecto, enlaces de agradecimiento y datos de contacto */
export const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section"> {/* Sección con información sobre el proyecto */}
                        <h3>Sobre el Proyecto</h3>
                        <p>
                            Herramienta para convertir frases a pictogramas atraves
                            de la api de ARASAAC, facilitando la comunicación
                            y el aprendizaje en entorno de aprendizaje.
                        </p>
                    </div>
                    <div className="footer-section"> {/* Sección de agradecimientos con enlace a ARASAAC */}
                        <h3>Enlaces de Agradecimiento</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="https://arasaac.org" target="_blank" rel="noopener noreferrer">
                                    ARASAAC
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section"> {/* Sección de contacto con dirección de correo electrónico */}
                        <h3>Contacto</h3>
                        <p>
                            ¿Tienes alguna pregunta o sugerencia?
                            <br />
                            <a href="#">alumno.568084@ies-azarquiel.es</a>
                        </p>
                    </div>
                </div>
                <div className="footer-copyright"> {/* Pie de página con derechos de autor y tipo de licencia */}
                    <p>&copy; Conversor de Pictogramas. Derechos bajo una Licencia Creative Commons BY-NC-SA.</p>
                </div>
            </div>
        </footer>
    );
};