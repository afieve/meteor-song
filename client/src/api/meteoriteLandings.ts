import { IMeteoriteLandingGeoJSONDocument } from "../types/MeteoriteLanding";

const meteoriteLandings = {

    getAll: async () : Promise<IMeteoriteLandingGeoJSONDocument[]> => {

        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/ml/get-all`, {
                method: "POST",
                mode: "cors"
            });
            const data = await res.json();
            return data;

        } catch (err) {
            console.error('Erreur lors de la récupération des données', err);
            throw err;
        }
    },
    getAllMarkersEssentials: async (): Promise<IMeteoriteLandingGeoJSONDocument[]> => {

        try {
            const res= await fetch(`${process.env.REACT_APP_SERVER_URL}/ml/get-markers-essentials`, {
                method: "POST",
                mode: "cors"
            });
            const data = await res.json();
            return data;
        } catch (err) {
            console.error('Erreur lors de la récupération des données', err);
            throw err;
        }
    }
}

export default meteoriteLandings;