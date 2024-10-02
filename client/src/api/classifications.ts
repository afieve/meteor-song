import { IClassification } from "../types/Classification";

const classifications = {

    getAll: async (): Promise<IClassification> => {
        
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/classif/tree`, {
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

export default classifications;