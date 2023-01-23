
function NavBar() {
    return (<div className="navbar">
        <nav>
            <div id="logo-game">
                <img src="/logo.png" alt="logo" id="logo-game"></img>
            </div>
            <div className="navigation-links">
                <a>Home</a>
                <a>About</a>
                <a>Contact</a>
            </div>
        </nav>
    </div> );
}

export default NavBar;