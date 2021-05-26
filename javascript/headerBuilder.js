const buildHeader = (rootDir, headerClass) => {
    /*
    const headers = document.getElementsByClassName(headerClass)
    for (let i = 0; i != headers.length; ++i) {
        headers.item(i)
    */
    document.querySelectorAll(headerClass)
        .forEach(header => {
            header.innerHTML += `
    <nav>
        <div class='name'>
            Mason Cutting
        </div>
        <ul class='navbar-menu'>
            <li class='navbar-item'>
                <a href='${rootDir}/index.html'>
                    Home
                </a>
            </li>
            <li class='navbar-item'>
                <a href='${rootDir}/pages/aboutMe.html'>
                    About Me
                </a>
            </li>
            <li class='navbar-item has-submenu'>
                <a>
                    Projects
                </a>
                <ul class='navbar-submenu'>
                    <li class='navbar-item has-submenu'>
                        <a>
                            p5.js Projects
                        </a>
                        <ul class='navbar-submenu'>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/digitalScene.html'>
                                    Digital Scene
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/stringThing.html'>
                                    String Thing
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/lightning.html'>
                                    Lightning
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/dice.html'>
                                    Dice
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/chemotaxis.html'>
                                    Chemotaxis
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/starfield.html'>
                                    Starfield
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class='navbar-item has-submenu'>
                        <a>
                            Regex
                        </a>
                        <ul class='navbar-submenu'>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/stringAlgorithms.html'>
                                    Text Info
                                </a>
                            </li>
                            <li class='navbar-item'>
                                <a href='${rootDir}/pages/projects/syntaxHighlighterDemo.html'>
                                    Syntax Highlighter Demo
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class='navbar-item has-submenu'>
                        <a>
                            Data Structures
                        </a>
                        <ul class='navbar-submenu'></ul>
                    </li>
                </ul>
            </li>
            <li class='navbar-item'>
                <a href='${rootDir}/pages/deepThoughts.html'>
                    Deep Thoughts
                </a>
            </li>
        </ul>
    </nav>
    <div class='banner'>
        <div class='banner-image'></div>
    </div>
`
});
}
