
import MeteoriteLandingModel from "../db/schema/MeteoriteLanding";

export async function getAllMeteoriteLandings(params: { geolocated: boolean }) {

    const filter = params.geolocated ? {
        reclat: { $ne: null },
        reclong: { $ne: null },
        "geolocation.lat": { $ne: null },
        "geolocation.lon": { $ne: null },
    } : {};

    try {

        const docs = await MeteoriteLandingModel.find(filter);
        return docs;

    } catch (err) {
        console.log(err);
    }
}

export async function getAllMeteoriteLandingsRecordClassification() {
    try {
        const docs = await MeteoriteLandingModel.distinct("recclass");
        return await docs;
    } catch (err) {
        console.log(err);
    }
}

export async function testMeteoriteLandingCreationDeletion() {
    const newMeteoriteLanding = new MeteoriteLandingModel({
        name: "Example Meteorite",
        year: 2024,
        mass: 1234.56,
        recclass: "Pallasite, PMG",
        reclat: 48.853176,
        reclong: 2.368982,
        fall: "Found",
        geolocation: {
            lat: 48.853176,
            lon: 2.368982
        },
        datastroID: 99999,
        country: "France",
        countryCode: "FR",
        departementFR: 75
    });

    try {
        const savedMeteoriteLanding = await newMeteoriteLanding.save();
        console.log('Nouvelle météorite créée:', savedMeteoriteLanding);

        const deletedMeteoriteLanding = await MeteoriteLandingModel.deleteOne({ _id: savedMeteoriteLanding._id })
        console.log('Nouvelle météorite supprimée:', deletedMeteoriteLanding);

        return {
            test: {
                name: "Création / suppression d'un document dans meteorite_landings",
                accomplished: true
            }
        }

    } catch (err) {
        console.log(err);
    }
}
