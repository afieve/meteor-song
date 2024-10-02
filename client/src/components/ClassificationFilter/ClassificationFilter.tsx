import React, { useEffect, useState } from 'react';
import { useClassificationsDataContext } from '../../context/ClassificationsDataContextProvider';
import { IClassification, IClassificationFilterEntry } from '../../types/Classification';
import './ClassificationFilter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight, faFolder } from '@fortawesome/free-solid-svg-icons';



const ClassificationFilter: React.FC = () => {
    const { classificationsData, selectedClassifications, selectClassification, deselectClassification } = useClassificationsDataContext();

    const [expandedClassifications, setExpandedClassifications] = useState<IClassificationFilterEntry[]>([]);

    useEffect(() => {
        console.log(classificationsData);
    }, [classificationsData]);

    useEffect(() => {
        console.log(`${selectedClassifications.length} classifications sélectionnées:`, selectedClassifications)
    }, [selectedClassifications]);

    useEffect(() => {
        console.log('expandedClassifications:', expandedClassifications);
    }, [expandedClassifications]);


    if (!classificationsData) {
        return <p>Chargement des classifications...</p>;
    }


    // Fonction pour gérer le clic sur une classification
    const handleClassificationSelection = (classification: IClassification) => {
        if (classification.uuid) {
            if (selectedClassifications.map(classif => classif.uuid).includes(classification.uuid)) {
                console.log('from handleClassificationSelection', {
                    classification: classification
                })
                deselectClassification(classification.uuid);
            } else {
                selectClassification(classification.uuid);
            }
        }

    };

    const handleClassificationExpansion = (classification: IClassification) => {
        
        // Gérer l'expansion des enfants
        if (classification.children && classification.children.length > 0) {

            let updatedExpanded: IClassificationFilterEntry[] = new Array<IClassificationFilterEntry>(...expandedClassifications);
            // const updatedExpanded: IClassificationFilterEntry[] = new Array<IClassificationFilterEntry>();

            if (classification.uuid) {

                // console.log('from handleClassificationExpansion:', {
                //     clicked: {
                //         uuid: classification.uuid,
                //         classCodes: classification.classCodes,
                //         children: classification.children.map(child => child.classCodes)
                //     },
                //     // updatedExpanded: updatedExpanded
                // })

                if (updatedExpanded.map(classif => classif.uuid).includes(classification.uuid)) {
                    
                    updatedExpanded = updatedExpanded.filter(classif => classif.uuid !== classification.uuid);
                    // console.log('from handleClassificationExpansion', {
                    //     updatedExpanded: updatedExpanded
                    // })
                } else {
                    updatedExpanded.push({ uuid: classification.uuid, classCodes: classification.classCodes });
                }
                setExpandedClassifications(updatedExpanded);
            }
        }
    }

    const renderClassifications = (classification: IClassification) => {

        // console.log(`rendering classif: ${classification.name ? classification.name.fr : ''}`);


        if (classification.uuid) {
            
            const isSelected = selectedClassifications.some(classif => classif.uuid === classification.uuid);
            const isExpanded = expandedClassifications.some(classif => classif.uuid === classification.uuid);

            if (isSelected || isExpanded) {
                
                console.log('from renderClassifications:', {
                    classCodes: classification.classCodes,
                    isSelected: isSelected,
                    isExpanded: isExpanded
                })
                
            }

            return (
                <div key={classification.uuid} className="classif-filter-list-item">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleClassificationSelection(classification)}
                    />

                    <label onClick={() => handleClassificationExpansion(classification)}>
                        {classification.children && classification.children.length > 0 && (
                            <>
                                <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} />
                                <FontAwesomeIcon icon={faFolder} />
                            </>
                        )}
                        {classification.label ? classification.label.fr : classification.name ? classification.name.fr : "<nom indéfini>"} {/* Remplace par l'attribut approprié */}
                    </label>
                    {isExpanded && classification.children && classification.children.length > 0 && (
                        <div style={{ paddingLeft: '20px' }}>
                            {classification.children.map(child => renderClassifications(child))}
                        </div>
                    )}
                </div>
            );
        }
    };



    return (
        <div>
            <h2 className="filter-title">Par classification</h2>
            {/* Afficher les classifications */}
            {classificationsData.children && classificationsData.children.map(classification => renderClassifications(classification))}
        </div>
    );
};

export default ClassificationFilter;
