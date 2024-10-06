import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IClassification, IClassificationFilterEntry } from "../types/Classification";
import classificationsAPI from "../api/classifications";
import { useMeteoriteDataContext } from "./MeteoriteDataContextProvider";

interface ClassificationsDataContextType {
    classificationsData: IClassification | null;
    selectedClassifications: IClassificationFilterEntry[];
    setSelectedClassifications: React.Dispatch<React.SetStateAction<IClassificationFilterEntry[]>>;
    selectClassification: (classificationId: string) => void;
    deselectClassification: (classificationId: string) => void;
    isClassificationSelected: (classificationId: string) => boolean;
    // getClassificationDescription: (recclass: string) => {recclass: string, eng: string, fr: string};//~ À implémenter
    // selectedClassifications: Set<string>;
    error: string | null;
}



const ClassificationsDataContext = createContext<ClassificationsDataContextType | undefined>(undefined);

export function useClassificationsDataContext() {
    const context = useContext(ClassificationsDataContext);
    if (!context) {
        throw new Error("useClassificationsDataContext must be used within a ClassificationsDataContextProvider");
    }
    return context;
}

interface DataProviderProps {
    children: ReactNode;
}

export function ClassificationsDataContextProvider({ children }: DataProviderProps) {

    /** Le jeu de données stocké dans DataContext.classificationsData sera fixe, tel que chargé au démarrage de l'application via le useEffect.
     *  Il sert de jeu de données de base pour la génération de la liste des filtres de classifications. 
    */
    const [classificationsData, setClassificationsData] = useState<IClassification | null>(null);
    const [selectedClassifications, setSelectedClassifications] = useState<IClassificationFilterEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null);

    const { activeFilters, setActiveFilters } = useMeteoriteDataContext();

    // Récupération de données lors du chargement de l'application
    useEffect(() => {
        async function fetchClassificationsData() {
            try {
                const data = await classificationsAPI.getAll();
                setClassificationsData(data);

            } catch (err) {
                setError('Erreur lors de la récupération des données');
            }
        }
        fetchClassificationsData();
    }, []);


    useEffect(() => {

        console.log('from useEffect[selectedClassifications]:', {
            selectedClassifications: selectedClassifications
        });
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            classification: selectedClassifications
        }));

    }, [selectedClassifications, setActiveFilters, classificationsData])

    // Sélection d'une classification, incluant la propagation aux enfants
    const selectClassification = (classificationId: string) => {
        if (!classificationsData) return;

        setSelectedClassifications((prevSelectedClassifications) => {
            const updatedSelections = [...prevSelectedClassifications];
    
            const classification = findClassificationById(classificationId, classificationsData);
            if (classification) {
                selectClassificationWithChildren(classification, updatedSelections);
            }
            return updatedSelections;
        });        

        // const updatedSelections: IClassificationFilterEntry[] = new Array<IClassificationFilterEntry>(...selectedClassifications);

        // const classification = findClassificationById(classificationId, classificationsData);
        // if (classification) {
        //     console.log('from selectClassification:', {
        //         updatedSelections: updatedSelections
        //     });
        //     selectClassificationWithChildren(classification, updatedSelections);
        // }
        // setSelectedClassifications(updatedSelections);
        // triggerUpdateDelay();
    };

    // Désélection d'une classification, incluant la propagation aux enfants
    const deselectClassification = (classificationId: string) => {
        if (!classificationsData) return;

        // let updatedSelections: IClassificationFilterEntry[] = new Array<IClassificationFilterEntry>(...selectedClassifications);
        setSelectedClassifications((prevSelectedClassifications) => {
            let updatedSelections = [...prevSelectedClassifications];

            const classification = findClassificationById(classificationId, classificationsData);
            if (classification) {
                updatedSelections = deselectClassificationWithChildren(classification, updatedSelections)
            }
            return updatedSelections;

        })

        // const classification = findClassificationById(classificationId, classificationsData);
        // console.log('from deselectClassification', {
        //     classification: classification
        // })
        // if (classification) {
        //     console.log('from deselectClassification:', '-- BEFORE deselectClassificationWithChildren --', {
        //         classification: classification,
        //         updatedSelections: updatedSelections
        //     });
        //     updatedSelections = deselectClassificationWithChildren(classification, updatedSelections);
        // }
        // console.log('from deselectClassification', '-- AFTER deselectClassificationWithChildren --', {
        //     updatedSelections: updatedSelections
        // })
        // setSelectedClassifications(updatedSelections);
        // triggerUpdateDelay();
    };

    // Vérifie si une classification est sélectionnée
    const isClassificationSelected = (classificationUUID: string): boolean => {
        return selectedClassifications.map(classif => classif.uuid).includes(classificationUUID);
    };

    // Fonction qui sélectionne une classification et tous ses enfants
    const selectClassificationWithChildren = (classification: IClassification, selectedArray: IClassificationFilterEntry[]) => {
        if (classification.uuid) {
            // selectedSet.add({uuid: classification.uuid, classCodes: classification.classCodes});
            selectedArray.push({ uuid: classification.uuid, classCodes: classification.classCodes })
        }
        if (classification.children) {
            classification.children.forEach(child => selectClassificationWithChildren(child, selectedArray));
        }
    };

    // Fonction qui désélectionne une classification et tous ses enfants
    const deselectClassificationWithChildren = (classification: IClassification, selectedArray: IClassificationFilterEntry[]) => {

        let updatedArray: IClassificationFilterEntry[] = selectedArray.filter(classif => classif.uuid !== classification.uuid);

        if (classification.children) {
            classification.children.forEach(child => {
                updatedArray = deselectClassificationWithChildren(child, updatedArray);
            });
        }
        return updatedArray;
    };

    // Trouve une classification par son ID
    const findClassificationById = (uuid: string, classification: IClassification): IClassification | null => {
        if (classification.uuid === uuid) {
            return classification;
        }

        if (classification.children) {
            for (const child of classification.children) {
                const found = findClassificationById(uuid, child);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    };

    // Déclenche un délai avant la mise à jour de `activeFilters`
    const triggerUpdateDelay = () => {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        const timeout = setTimeout(() => {
            // console.log(`${selectedClassifications.size} classifications sélectionnées`, selectedClassifications);
            // Ici, on pourrait mettre à jour un attribut comme `activeFilters`
            console.log("Mise à jour des filtres actifs après un délai.");
        }, 3000); // Délai de 5 secondes
        setUpdateTimeout(timeout);
    };
    /*//~ À implémenter
    const getClassificationDescription = async (recclass: string) => {
        try {

            const classificationDescription = await classificationsAPI.getDescription(recclass);
            return classificationDescription;

        } catch (err) {

        }
    }
    */



    return (
        <ClassificationsDataContext.Provider
            value={{
                classificationsData,
                selectedClassifications,
                setSelectedClassifications,
                selectClassification,
                deselectClassification,
                isClassificationSelected,
                // getClassificationDescription,//~ À implémenter
                error,
            }}
        >
            {children}
        </ClassificationsDataContext.Provider>
    )

}