import './InfosModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';


export default function DetailsModal() {



    const [modalIsOpen, setModalIsOpen] = useState(false);


    return (
        <div id="infos-modal">
            <div id="infos-modal-header">
                <div id="infos-modal-header-left">
                    <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                        <FontAwesomeIcon icon={faInfo} fontSize={25} />
                    </button>
                    {modalIsOpen && (
                        <h4>Lorem ipsum dolor sit.</h4>
                    )}
                </div>
                {modalIsOpen && (
                    <div id="infos-close-btn-container">
                        <button id="infos-close-btn" onClick={() => setModalIsOpen(false)} >
                            <FontAwesomeIcon icon={faClose} fontSize={20} />
                        </button>
                    </div>
                )}
            </div>
            {modalIsOpen && (
                <>
                    <div id="infos-modal-body">
                        <p>Les météorites sont généralement nommées d'après le lieu près duquel on les trouve.<br /><br />Puisqu'elles se désagrègent lors de leur passage à travers l'atmosphère et de leur chute, puis éclatent à leur impact sur le sol terrestre, on trouve souvent plusieurs fragments d'une météorite près d'un même lieu. C'est ainsi que les noms de certaines météorites sont nommées d'après le même lieu (ex: Allan Hills A77255, Allan Hills A80104, Allan Hills A81014).
                        </p>
                    </div>
                    <div id="infos-modal-footer">
                        <div id="infos-modal-footer-page-cursor">
                            <span>1</span>
                            <span>/</span>
                            <span>10</span>
                        </div>
                    </div>
                </>

            )}
        </div>
    )

}