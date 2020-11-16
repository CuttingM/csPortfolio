const buildHeader = (rootDir, headerClass) => {
    let header = document.querySelector(headerClass);
    header.innerHTML += `
    <nav>
        <div class='name'>Mason Cutting</div>
        <ul class='navbar-menu'>
            <li class='navbar-item'>
                <a href='${rootDir}/index.html'>Home</a>
            </li>
            <li class='navbar-item'>
                <a href='${rootDir}/pages/aboutMe.html'>About Me</a>
            </li>
            <li class='navbar-item has-submenu'>
                <a>Projects</a>
                <ul class='navbar-submenu'>
                    <li class='navbar-item'>
                        <a href='${rootDir}/pages/projects/digitalScene.html'>Digital Scene</a>
                    </li>
                    <li class='navbar-item'>
                        <a href='${rootDir}/pages/projects/stringThing.html'>String Thing</a>
                    </li>
                    <li class='navbar-item'>
                        <a href='${rootDir}/pages/projects/lightning.html'>Lightning</a>
                    </li>
                    <li class='navbar-item'>
                        <a href='${rootDir}/pages/projects/dice.html'>Dice</a>
                    </li>
                    <li class='navbar-item'>
                        <a href='${rootDir}/pages/projects/chemotaxis.html'>Chemotaxis</a>
                    </li>
                    <li class='navbar-item has-submenu'>
                        <a>Data Structures</a>
                        <ul class='navbar-submenu'>
                            <li class='navbar-item'>
                                <a>Test</a>
                            </li>
                            <li class='navbar-item has-submenu'>
                                <a>This is another menu</a>
                                <ul class='navbar-item navbar-submenu'>
                                    <li class='navbar-item'>
                                        <a>Test1</a>
                                    </li>
                                    <li class='navbar-item'>
                                        <a>Test2</a>
                                    </li>
                                    <li class='navbar-item'>
                                        <a>Test3</a>
                                    </li>
                                </ul>
                            </li>
                            <li class='navbar-item'>
                                <a>_</a>
                            </li>
                            <li class='navbar-item has-submenu'>
                                <a>This is another menu</a>
                                <ul class='navbar-item navbar-submenu'>
                                    <li class='navbar-item'>
                                        <a>Test1</a>
                                    </li>
                                    <li class='navbar-item'>
                                        <a>Test2</a>
                                    </li>
                                    <li class='navbar-item'>
                                        <a>Test3</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class='navbar-item'>
                <a href='${rootDir}/pages/deepThoughts.html'>Deep Thoughts</a>
            </li>
        </ul>
    </nav>
    <div class='banner'>
        <div class='banner-image'></div>
    </div>
    `
}
