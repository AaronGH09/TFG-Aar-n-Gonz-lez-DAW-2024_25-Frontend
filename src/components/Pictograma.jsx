import React, { useContext } from 'react';
import { ContextPictos } from '../context/PictosProvider';

/* Componente  Pictograma. Muestra la imagen del pictograma, su palabra asociada y permite cambiar el id del pictograma por otro mas adecuado */
export const Pictograma = ({ picto }) => {
    const { cambiarPictograma } = useContext(ContextPictos); // Obtenemos la función cambiarPictograma del contexto 

    return (
        <div className="pictogram-card">
            {picto.id ? ( /* Si el pictograma tiene id, se muestra el pictograma completo y si no solo se muestra la palabra */
                <>
                    <div className="div-pictogram-image">
                        <img // Imagen del pictograma
                            src={`https://static.arasaac.org/pictograms/${picto.id}/${picto.id}_500.png`}
                            alt={picto.palabra}
                            style={{ // Estilos para que la exportacion como PNG o PDF salga bien
                                objectFit: "contain",
                                width: "60%",
                                height: "60%"
                            }}
                            className="pictogram-image"
                        />
                    </div>

                    <div className="pictogram-palabra"> {/* Palabra asociada al pictograma */}
                        <p>{picto.palabra.toUpperCase()}</p>
                    </div>

                    <div className='pictogram-select'  data-html2canvas-ignore="true"> {/* Botones para cambiar el pictograma es ignorado a la hora de exportar*/}
                        <button onClick={() => cambiarPictograma(-1, picto.posicion)}>←</button>
                        <span>Selecionar</span>
                        <button onClick={() => cambiarPictograma(1, picto.posicion)}>→</button>
                    </div>
        </>
    ) : (
        <div className="pictogram-palabra-only">
            <p>{picto.palabra.toUpperCase()}</p>
        </div>
    )
}
        </div >
    );
}; 