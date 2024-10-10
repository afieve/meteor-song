import './DetailsModal.css';

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMeteor } from "@fortawesome/free-solid-svg-icons";
import { closeDetailsModal, toggleOpenCloseDetailsModal } from '../../store/slices';
import classifications from '../../api/classifications';
import { useEffect, useState } from 'react';


export default function DetailsModal() {

    const detailedMeteorite = useSelector((state: RootState) => state.detailedMeteorite);
    const [classDescription, setClassDescription] = useState<{ eng: string; fr: string; } | null>(null);
    const [classDescriptionIsLoading, setClassDescriptionIsLoading] = useState<boolean>(true);
    const modalIsOpen = useSelector((state: RootState) => state.meteoriteDetailsModal.isOpen);
    const dispatch = useDispatch();


    useEffect(() => {
        async function fetchMeteoriteClassDescription(recclass: string) {
            try {
                const classif = await classifications.getSingle(recclass);
                if (classif) {
                    setClassDescription(classif.description);
                } else {
                    setClassDescription(null);
                }
                setClassDescriptionIsLoading(false);

            } catch (err) {
                console.error(err);
            }
        }
        if (detailedMeteorite.meteorite?.properties.recclass) {
            fetchMeteoriteClassDescription(detailedMeteorite.meteorite?.properties.recclass);
        }
    }, [detailedMeteorite]);

    /*
    useEffect(() => {
        if (classDescription) {
            console.log('classDescription:', classDescription);
        }

    }, [classDescription]);
    */

    return (
        <div id="met-details-modal">
            <div id="met-details-modal-header">
                <div id="met-details-modal-header-left">
                    <button onClick={() => dispatch(toggleOpenCloseDetailsModal())}>
                        <FontAwesomeIcon icon={faMeteor} fontSize={25} />
                    </button>
                    {modalIsOpen && detailedMeteorite.meteorite && (
                        <h4>{detailedMeteorite.meteorite.properties.name}</h4>
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
            {modalIsOpen && detailedMeteorite.meteorite && (
                <div id="met-details-modal-body">
                    <table>
                        <tbody>
                            <tr>
                                <td>état de la découverte</td>
                                <td>{detailedMeteorite.meteorite.properties.fall === "Found" ? "trouvée" : "tombée"}</td>
                            </tr>
                            <tr>
                                <td>date</td>
                                <td>{detailedMeteorite.meteorite.properties.year?.toString()}</td>
                            </tr>
                            <tr>
                                <td>pays</td>
                                {detailedMeteorite.meteorite.properties.country ?
                                    <td>{detailedMeteorite.meteorite.properties.country}</td>
                                    :
                                    <td style={{ opacity: 0.5, fontWeight: 100 }}><em>inconnu</em></td>
                                }
                            </tr>
                            <tr>
                                <td>masse</td>
                                {detailedMeteorite.meteorite.properties.mass ?
                                    <td>{detailedMeteorite.meteorite.properties.mass / 1000}&nbsp;kg</td>
                                    :
                                    <td style={{ opacity: 0.5 }}><em>inconnue</em></td>
                                }
                            </tr>
                            <tr>
                                <td>classification</td>
                                <td style={detailedMeteorite.classColor ? { color: detailedMeteorite.classColor } : { color: '#fff' }}>{detailedMeteorite.meteorite.properties.recclass}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p>
                        <span style={{
                            color: detailedMeteorite.classColor ? detailedMeteorite.classColor : '#fff',
                            fontWeight: 600
                        }}>
                            {detailedMeteorite.meteorite.properties.recclass}
                        </span>
                        &nbsp;:&nbsp;

                        {classDescriptionIsLoading ? (
                            <span style={{ color: "#808080" }}><em>Récupération de la définition...</em></span>
                        ): classDescription ? (
                            classDescription.eng ? classDescription.eng
                                : classDescription.fr && classDescription.fr
                        ) : (
                            <span style={{ color: "#808080" }}><em>Pour le moment, aucune description n'existe pour cette classe.</em></span>
                        )}
                    </p>
                </div>
            )
            }
        </div >
    )

}