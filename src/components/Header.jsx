import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

/* Componente Header que representa la cabecera del sitio. Incluye el logo, el título del proyecto y un menú de navegación */
export const Header = () => {

    return (
        <header className="header">
            <div className="container header-content">
                <div className="logo"> {/* Sección del logo y título */}
                    <img src={Logo} alt="Logo" />
                    <h1>Conversor de Pictogramas</h1>
                </div>
                <nav className="nav-menu"> {/* Menú de navegación con enlaces internos y externos*/}
                    <Link to="/">Inicio</Link>
                    <Link to="/juego">Minijuego</Link>
                    <a href="https://arasaac.org" target="_blank" rel="noopener noreferrer">ARASAAC</a>
                </nav>
            </div>
        </header>
    );
};