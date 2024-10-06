import './DetailsModal.css';

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMeteor } from "@fortawesome/free-solid-svg-icons";
import { closeDetailsModal, toggleOpenCloseDetailsModal } from '../../store/slices';


export default function DetailsModal() {

    const detailedMeteorite = useSelector((state: RootState) => state.detailedMeteorite.meteorite);
    const modalIsOpen = useSelector((state: RootState) => state.meteoriteDetailsModal.isOpen);
    const dispatch = useDispatch();

    

    return (
        <div id="met-details-modal">
            <div id="met-details-modal-header">
                <div id="met-details-modal-header-left">
                    <button  onClick={() => dispatch(toggleOpenCloseDetailsModal())}>
                        <FontAwesomeIcon icon={faMeteor} fontSize={25}/>
                    </button>
                    {modalIsOpen && detailedMeteorite && (
                        <h4>{detailedMeteorite.properties.name}</h4>
                    )}
                </div>
                {modalIsOpen && detailedMeteorite && (
                    <div id="met-details-close-btn-container">
                        <button id="met-details-close-btn" onClick={() => dispatch(closeDetailsModal())} >
                            <FontAwesomeIcon icon={faClose} fontSize={20} />
                        </button>
                    </div>
                )}
            </div>
            {modalIsOpen && detailedMeteorite && (
            <div id="met-details-modal-body">
                <table>
                    <tbody>
                        <tr>
                            <td>état de la découverte</td>
                            <td>{detailedMeteorite.properties.fall === "Found" ? "trouvée" : "tombée"}</td>
                        </tr>
                        <tr>
                            <td>date</td>
                            <td>{detailedMeteorite.properties.year?.toString()}</td>
                        </tr>
                        <tr>
                            <td>pays</td>
                            {detailedMeteorite.properties.country ?
                            <td>{detailedMeteorite.properties.country}</td>
                            :
                            <td style={{opacity: 0.5, fontWeight:100}}><em>inconnu</em></td>
                            }
                        </tr>
                        <tr>
                            <td>classification</td>
                            <td>{detailedMeteorite.properties.recclass}</td>
                        </tr>
                        
                        <tr>
                            <td>masse</td>
                            {detailedMeteorite.properties.mass ?
                            <td>{detailedMeteorite.properties.mass / 1000}&nbsp;kg</td>
                            :
                            <td style={{opacity: 0.5}}><em>inconnue</em></td>
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
            )}
        </div>
    )

}