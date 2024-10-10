import './InfosModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

interface Fact {
    title: string;
    body: string[];
}

export default function DetailsModal() {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [factIndex, setFactIndex] = useState(0);

    const facts: Fact[] = [
        {
            title: "Le nom des météorites",
            body: ["Les météorites sont généralement nommées d'après le lieu près duquel on les trouve.", "Puisqu'elles se désagrègent lors de leur passage à travers l'atmosphère et de leur chute, puis éclatent à leur impact sur le sol terrestre, on trouve souvent plusieurs fragments d'une météorite près d'un même lieu. C'est ainsi que les noms de certaines météorites sont nommées d'après le même lieu (ex: Allan Hills A77255, Allan Hills A80104, Allan Hills A81014)."]
        },
        {
            title: "La plus grande météorite jamais tombée",
            body: ["Il s'agit de la météorite d'Hoba, qui pèse 60 000 tonnes !"]
        }
    ];

    return (
        <div id="infos-modal">
            <div id="infos-modal-header">
                <div id="infos-modal-header-left">
                    <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                        <FontAwesomeIcon icon={faInfo} fontSize={25} />
                    </button>
                    {modalIsOpen && (
                        <h4>Le nom des météorites.</h4>
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
                        {facts[factIndex].body.map(paragraph => <p>{paragraph}</p>)}
                    </div>
                    <div id="infos-modal-footer">
                        <div id="infos-modal-footer-page-cursor">
                            {factIndex > 0 ? (
                                <button onClick={() => setFactIndex(factIndex - 1)}>&#8249;</button>
                            ) : (
                                <div>&nbsp;</div>
                            )}
                            <div id="infos-modal-footer-page-indicator">
                                <div>{factIndex + 1}</div>
                                <div>/</div>
                                <div>{facts.length}</div>
                            </div>
                            {factIndex < facts.length - 1 ? (
                                <button onClick={() => setFactIndex(factIndex + 1)}>&#8250;</button>
                            ) : (
                                <div>&nbsp;</div>
                            )}
                        </div>
                    </div>
                </>

            )}
        </div>
    )

}