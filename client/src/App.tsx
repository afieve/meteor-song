import React, { useEffect, useState } from 'react';
import './App.css';
import "leaflet/dist/leaflet.css";
import Footer from './footer/Footer';
import MeteorPage from './pages/MeteorPage';
import AboutPage from './pages/AboutPage';
import RightMenu from './rightmenu/RightMenu';
import logRender from './utils/logCompRender';
// import meteoriteLandings from './api/meteoriteLandings';


function App() {

    const [openPage, setOpenPage] = useState('MeteorPage');
    const [openRightMenu, setOpenRightMenu] = useState(false); // Transmettre le setter au composant MeteorPageHeader

    useEffect(() => {
        logRender('App');
    }, []);

    return (
        <div className="App">
            <div className="Page">
                {
                    openPage === "MeteorPage" ?
                        <MeteorPage openRightMenu={openRightMenu} setOpenRightMenu={setOpenRightMenu} />
                        : openPage === "AboutPage" &&
                        <AboutPage />
                }
                <Footer openPage={openPage} setOpenPage={setOpenPage} />
            </div>
            {openPage === "MeteorPage" && openRightMenu && <RightMenu />}
        </div>
    );
}

export default App;
