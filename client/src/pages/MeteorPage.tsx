import './MeteorPage.css';

import MeteorPageHeader from "../headers/MeteorPageHeader/MeteorPageHeader";
import { LeafletComponentMap } from '../components/map/LeafletComponentMap/LeafletComponentMap';
import DetailsModal from '../components/DetailsModal/DetailsModal';
import InfosModal from '../components/InfosModal/InfosModal';
// import MeteorMap from '../components/map/MeteorMap/MeteorMap';
// import MapGLMeteorMap from '../components/map/MapGLMeteorMap/MapGLMeteorMap';

interface MeteorPageParams {
    openRightMenu: boolean;
    setOpenRightMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MeteorPage({ openRightMenu, setOpenRightMenu }: MeteorPageParams) {

    return (
        <div className="MeteorPage">
            <MeteorPageHeader openRightMenu={openRightMenu} setOpenRightMenu={setOpenRightMenu} />

            {/* <MeteorMap /> */}
            <div id="left-modals-container">

                <InfosModal />
                <DetailsModal />
            </div>
            <LeafletComponentMap />
            {/* <MapGLMeteorMap /> */}


        </div>

    )
}