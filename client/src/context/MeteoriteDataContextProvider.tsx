import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import meteoriteLandingsAPI from "../api/meteoriteLandings";
import { IMeteoriteLandingGeoJSONDocument } from "../types/MeteoriteLanding";
import { Filters } from "../types/Filters";

interface MeteoriteDataContextType {
    meteoritesData: IMeteoriteLandingGeoJSONDocument[];
    activeFilters: Filters;
    setActiveFilters: React.Dispatch<React.SetStateAction<Filters>>;
    filteredMeteorites: IMeteoriteLandingGeoJSONDocument[];
    error: string | null;
}

const MeteoriteDataContext = createContext<MeteoriteDataContextType | undefined>(undefined);

export function useMeteoriteDataContext() {
    const context = useContext(MeteoriteDataContext);
    if (!context) {
        throw new Error("useMeteoriteDataContext must be used within a MeteoriteDataContextProvider");
    }
    return context;
}

interface DataProviderProps {
    children: ReactNode;
}

export function MeteoriteDataContextProvider({ children }: DataProviderProps) {

    /** Le jeu de données stocké dans DataContext.meteoritesData sera fixe, tel que chargé au démarrage de l'application via le useEffect.
     *  Il ne sera jamais modifié par la sélection de filtres par l'utilisateur.
     *  Lorsqu'un filtre est paramétré par l'utilisateur via le composant qui l'affiche:
     *      1. ledit-composant met à jour la propriété de filtre dans DataContext.activeFilters,
     *      2. le hook useMemo `displayedMeteorites` est déclenché, et retourne à DataContext.displayedMeteorites la liste des météorites filtrées,
     *      3. n'importe quel composant de l'application peut appeler la DataContext.displayedMeteorites pour accéder aux météorites filtrées.
     *  */
    // 
    const [meteoritesData, setMeteoritesData] = useState<IMeteoriteLandingGeoJSONDocument[]>([]);
    const [activeFilters, setActiveFilters] = useState<Filters>({
        classification: [],
        massRange: [0, 60000000],
        yearRange: [1400, 2020]
    });
    const [error, setError] = useState<string | null>(null);


    // Simulatation de la récupération de données lors du chargement de l'application
    useEffect(() => {
        async function fetchMeteoriteLandingsData() {
            try {
                const data = await meteoriteLandingsAPI.getAll();
                setMeteoritesData(data);
            } catch (err) {
                setError('Erreur lors de la récupération des données');
            }
        }
        fetchMeteoriteLandingsData();
    }, []);

    useEffect(() => {
        /*
        console.log('activeFilters', {
            classification: activeFilters.classification,
            massRange: activeFilters.massRange,
            yearRange: activeFilters.yearRange
        })
        */
    }, [activeFilters])


    // Utilisation de useMemo pour ne recalculer les météorites affichées que lorsque les filtres sélectionnés par l'utilisateur changent
    const filteredMeteorites: IMeteoriteLandingGeoJSONDocument[] = useMemo(() => {

        // Appliquer les filtres aux données des météorites
        return meteoritesData.filter((meteorite: IMeteoriteLandingGeoJSONDocument) => {

            const { recclass, mass, year } = meteorite.properties; // Propriétés de la météorite courante


            //~ console.log('activeFilters.classification.length', '===', activeFilters.classification.length, activeFilters.classification.length > 0 ? activeFilters.classification : "<vide>");

            let matches: Record<string, boolean> = { classification: false, mass: false, year: false };

            //~ console.log('from meteorite filter `filteredMeteorites()`:', 'meteorites.properties.uuid=', uuid);
            matches.classification = recclass
                ? activeFilters.classification.length === 0 || activeFilters.classification.map(classification => classification.classCodes ? classification.classCodes[0] : null).includes(recclass)
                : activeFilters.classification.length === 0;
                
            matches.mass = mass
                ? mass >= activeFilters.massRange[0] && mass <= activeFilters.massRange[1]
                // Si la météorite n'a pas d'attribut `mass`, on ne l'affiche que si le filtre de masse est réglé sur ses valeurs min et max par défaut
                : matches.mass = activeFilters.massRange[0] === 0 && activeFilters.massRange[1] >= 60000000;

            matches.year = year
                ? year >= activeFilters.yearRange[0] && year <= activeFilters.yearRange[1]
                // Si la météorite n'a pas d'attribut `year`, on ne l'affiche que si le filtre de mass est réglé sur ses valeurs min et max par défaut
                : activeFilters.yearRange[0] <= 1400 && activeFilters.yearRange[1] >= 2020

            return matches.classification && matches.mass && matches.year;
        })

    }, [meteoritesData, activeFilters]);

    return (
        <MeteoriteDataContext.Provider value={{ meteoritesData, activeFilters, setActiveFilters, filteredMeteorites, error }}>
            {children}
        </MeteoriteDataContext.Provider>
    )

}