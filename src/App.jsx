import { Routes, Route } from "react-router-dom";
import { Inicio } from './pages/Inicio';
import { Juego } from "./pages/juego";
import { PictosProvider } from "./context/PictosProvider";
import './index.css'

function App() {

  return (
    <>
      <PictosProvider> {/* Envolvemos toda la pagina con el provider para poder pasar datos y funciones entre los componentes */}
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/juego" element={<Juego />} />
        </Routes>
      </PictosProvider>  
    </>
  )
}

export default App
