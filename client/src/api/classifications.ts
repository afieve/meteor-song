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
    },
    getSingle: async (recclass:string) => {
        // console.log('input:', recclass);
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/classif/get-single`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                mode: "cors",
                body: JSON.stringify({recclass: recclass})
            });
            const data = await res.json();
            // console.log('from .getSingle =>', data);
            return data;
            
        } catch (err) {
            console.error(`Erreur lors de la récupération de la description de la description de '${recclass}':`, err);
        }
    }
}

export default classifications;