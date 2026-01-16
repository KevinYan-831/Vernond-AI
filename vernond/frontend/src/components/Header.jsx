import logo from '../assets/logo.png';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <a href="/" className="header__logo">
                    <img
                        src={logo}
                        alt="Vernond AI"
                        className="header__logo-img"
                    />
                </a>
            </div>
        </header>
    );
}

export default Header;
