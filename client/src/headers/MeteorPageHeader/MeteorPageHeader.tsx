import './MeteorPageHeader.css';
import './logo-af.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSliders, faSun } from '@fortawesome/free-solid-svg-icons';
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


    return (
        <header>
            <div className="header-left">
                <LogoAF box={{
                    width: 46,
                    height: 47
                }} />

                <div className={`switch-container ${currentTheme}`} onClick={() => dispatch(toggleTheme())}>
                    <div className={`ball ${currentTheme}`}>
                        {currentTheme === "dark" && <FontAwesomeIcon icon={faMoon} />}
                        {currentTheme === "light" && <FontAwesomeIcon icon={faSun} />}
                    </div>
                </div>

                <div className='space-logs'>
                    <p>Météorites...</p>
                </div>

            </div>

            <div className="header-right">
                <button className="open-right-menu-button" onClick={() => setOpenRightMenu(!openRightMenu)}>
                    <FontAwesomeIcon icon={faSliders} className="icon" />
                </button>
            </div>

        </header>
    )
}

export function LogoAF({ box }: LogoAFProps) {
    return (
        <svg width={box.width} height={box.height} viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="39" cy="39.0034" r="39" fill="#18963A" />
            <path d="M16.1201 34.6807C19.4986 25.1144 25.9661 24.2238 31.3718 26.5638C42.0865 31.202 40.6005 45.6485 39.0941 48.4021C34.6974 56.4388 21.7675 53.1887 21.0431 45.3264C19.3144 26.5638 41.797 43.1841 53.7666 38.3526M55.9868 14.6784C48.361 6.85147 39.0941 9.60327 39.0941 18.1571C39.0941 26.7109 42.0222 55.1661 42.7622 70.7234" stroke="#B4F7C6" strokeWidth="6" strokeLinecap="round" />
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