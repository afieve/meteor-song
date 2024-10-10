import './MeteorPageHeader.css';
import './logo-af-gradient.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faRobot, faSliders, faSun } from '@fortawesome/free-solid-svg-icons';
import QueryTestButton from '../../components/QueryTestButton/QueryTestButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleTheme } from '../../store/slices';

interface MeteorPageHeaderParams {
    openRightMenu: boolean;
    setOpenRightMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LogoAFProps {
    box: {
        width: number;
        height: number;
    }
}

export default function MeteorPageHeader({ openRightMenu, setOpenRightMenu }: MeteorPageHeaderParams) {

    const dispatch = useDispatch();
    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
    const spaceLog = useSelector((state: RootState) => state.spaceLog);


    return (
        <header>
            <div className="header-left">
                <LogoAF box={{
                    width: 44,
                    height: 42
                }} />
                {/* 
                <div className={`switch-container ${currentTheme}`} onClick={() => dispatch(toggleTheme())}>
                    <div className={`ball ${currentTheme}`}>
                        {currentTheme === "dark" && <FontAwesomeIcon icon={faMoon} />}
                        {currentTheme === "light" && <FontAwesomeIcon icon={faSun} />}
                    </div>
                </div>
                */}

                <div id="space-logs">
                    <FontAwesomeIcon icon={faRobot} id="space-logs-robot-icon" />
                    <p>
                        {spaceLog.msg}
                    </p>
                    {spaceLog.loading && <div id="space-logs-loader"></div>}
                </div>

            </div>

            <div className="header-right">
                <button id="open-right-menu-button" onClick={() => setOpenRightMenu(!openRightMenu)}>
                    <FontAwesomeIcon icon={faSliders} className="icon" />
                </button>
            </div>

        </header>
    )
}

export function LogoAF({ box }: LogoAFProps) {
    return (
        <svg width={box.width} height={box.height} viewBox="0 0 47 47" fill="none" id="logo-af-gradient" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="75%" fx="50%" fy="80%">
                    <stop offset="55%" stopColor="#0D0D0D" />
                    <stop offset="100%" stopColor="#D5D5D5" />
                </radialGradient>
            </defs>
            <circle cx="23.5" cy="23.5" r="23.5" fill="url(#grad1)" />
            <path d="M9.71289 20.8953C11.7487 15.131 15.6457 14.5944 18.903 16.0044C25.3593 18.7992 24.4639 27.5041 23.5562 29.1633C20.9069 34.0059 13.1158 32.0475 12.6793 27.31C11.6376 16.0044 25.1848 26.0191 32.3973 23.1078M33.7351 8.84264C29.1401 4.12638 23.5562 5.78452 23.5562 10.9387C23.5562 16.093 25.3205 33.239 25.7665 42.6133" stroke="#E9E8E7" strokeWidth="3" strokeLinecap="round" />
        </svg>

    )
}

export function QueryTestButtons() {

    return (
        <>
            <QueryTestButton queryPath={''} title={'check server response'} />
            <QueryTestButton queryPath={'ml'} title={'get all meteorite landings data'} />
            <QueryTestButton queryPath={'classif'} title={'get classification tree'} />
            <QueryTestButton queryPath={'classif/generate-and-insert'} title={'classification tree creation/deletion'} />
        </>
    )
}