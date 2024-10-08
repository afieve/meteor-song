import MeteoriteLandingModel, { IMeteoriteLandingGeoJSONDocument } from "../db/model/MeteoriteLandingModel";

import fs from 'fs';
import path from 'path';

// READ 

export async function getAllMeteoriteLandings(params: { geolocated: boolean, markersEssentials: boolean }) {

    const filter = params.markersEssentials ? {
        "geometry.coordinates.0": { $ne: null },
        "geometry.coordinates.1": { $ne: null },
        "properties.mass": { $ne: null }
    } : params.geolocated ? {
        "geometry.coordinates.0": { $ne: null },
        "geometry.coordinates.1": { $ne: null },
        "properties.mass": { $ne: null }
    } : {};

    const projection = params.markersEssentials ? {
        _id: 0,
        "properties.year": 0,
        "properties.fall": 0,
        "properties.country": 0,
        "properties.countryCode": 0,
        "properties.departementFR": 0,
        "properties.nametype": 0,
    } : {
        _id: 0,
        "properties.countryCode": 0,
        "properties.nametype": 0,
        "properties.departementFR": 0
    };

    try {
        console.log("hello from getAllMeteoriteLandings() : trying to get data...");
        // const docs = await MeteoriteLandingModel.find(filter, projection);
        // console.log(docs.length, "documents récupérés dans getAllMeteoriteLandings");
        // return docs;
        return await MeteoriteLandingModel.find(filter, projection).lean().exec();

    } catch (err) {
        console.log("Erreur lrrs de la récupération de toutes les données de météorites:", err);
    }
}

export async function getAllMeteoriteLandingsRecclass() {
    try {
        const docs = await MeteoriteLandingModel.distinct("recclass");
        return await docs;
    } catch (err) {
        console.log(err);
    }
}

export async function getSingleMeteoriteByDatastroId(datastroID: number) {
    try {
        const doc = await MeteoriteLandingModel.findOne({ "properties.datastroID": datastroID });
        return doc;
    } catch (err) {
        console.log(err);
    }
}

// CREATE & DELETE (TEST)
interface MeteoriteLandingRawGeoJSONFileDataFeature {
    type: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    properties: {
        name: string;
        year: string; // sera transformé en number pour s'adapter au type du document.year
        country: string;
        departement_fr: string | null;
        recclass: string;
        mass_g: number;
        reclat: number;
        reclong: number;
        nametype?: string;
        fall: string;
        country_code: string;
        id: number;
    }

}
interface MeteoriteLandingsRawGeoJSONFileData {
    type: string;
    features: MeteoriteLandingRawGeoJSONFileDataFeature[];
}
export async function insertAllMeteoriteLandingsGeoJSONDataToCollection() {

    try {
        const geoJSONFilePath = path.join(process.cwd(), "data", "raw-data", "meteorite-landings@datastro.geojson");
        const geoJSONFileData: MeteoriteLandingsRawGeoJSONFileData = importGeoJSONFile(geoJSONFilePath);

        const previewDocsCountLimit = 100;

        const docs: IMeteoriteLandingGeoJSONDocument[] = geoJSONFileData.features.map((feature) => {

            return {
                type: feature.type || "Feature",
                //! Important: Les données d'origine du fichier GeoJSON, export de la base Datastro (https://www.datastro.eu/explore/dataset/meteorite-landings/export/?flg=fr-fr&disjunctive.country&disjunctive.recclass&sort=year), placent les données de longitude & latitude dans l'ordre inverse de la norme [latitude, longitude]. On inverse donc ceci dans le modèle des documents qu'on souhaite, avant qu'ils soient insérés en base de données, notamment parce que c'est l'ordre attendu par Leaflet, & bien d'autres services utilisant la géolocalisation.
                geometry: feature.geometry ? {
                    type: feature.geometry.type || "Point",
                    coordinates: [
                        feature.geometry.coordinates[1] || feature.properties.reclat,
                        feature.geometry.coordinates[0] || feature.properties.reclong
                    ]
                } : null,
                properties: {
                    name: feature.properties.name,
                    recclass: feature.properties.recclass,
                    mass: feature.properties.mass_g,
                    fall: feature.properties.fall,
                    year: parseInt(feature.properties.year) || null,
                    datastroID: feature.properties.id,
                    country: feature.properties.country,
                    countryCode: feature.properties.country_code,
                    departementFR: feature.properties.departement_fr,
                    nametype: feature.properties.nametype,
                }
            }
        });

        const docsWithFalsyValues = docs.filter(doc => {
            if (
                !doc.geometry
                // || !doc.properties.country
                // || !doc.properties.countryCode
                // || !doc.properties.departementFR
            ) {
                return true;
            } else return false;
        });


        try {
            await MeteoriteLandingModel.insertMany(docs);

        } catch (err) {
            throw new Error(`Erreur lors de l'utilisation du modèle MeteoriteLandingModel: ${err}`);
        }


        return {
            message: `Tâche terminée. ${docs.length} documents ont été insérés dans la base de données.`,
            data: {
                preview: {
                    count: previewDocsCountLimit,
                    docs: {
                        rawGeoJSONFileData: geoJSONFileData.features.slice(0, previewDocsCountLimit),
                        mongoDBDocs: docs.slice(0, previewDocsCountLimit)
                    }
                },
                hasFalsyValues: {
                    count: previewDocsCountLimit,
                    mongoDBDocs: docsWithFalsyValues.slice(0, previewDocsCountLimit)
                }
            }
        }

    } catch (err) {
        throw new Error(`Erreur lors de l'insertion des données d'atterrissage depuis le fichier GeoJSON: ${err}`);
    }

}
function importGeoJSONFile(filePath: string): MeteoriteLandingsRawGeoJSONFileData {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try {
        const jsonData = JSON.parse(fileContent);
        return jsonData;
    } catch (err) {
        throw new Error(`Error parsing JSON file: ${err.message}`);
    }
}


// UPDATE

export async function mergeSameMeteoriteLandingDocuments() {

    /** mergedResults: Aggrégation, et merging des documents doublons dans la collection 'meteorite_landings',.
     *      Retourne une liste des propriétés des documents produits de l'opération.
     *  
     *      Nécessite ensuite l'opération qui supprime les doublons d'origine,
     *      Puis celle qui ajoute ces documents produits du merging à la collection.
     * */
    const mergedResults = await MeteoriteLandingModel.aggregate([
        {
            $group: {
                _id: "$properties.name",
                documents: {
                    $push: "$$ROOT"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $match: {
                count: {
                    $gte: 2
                }
            }
        },
        {
            $project: {
                _id: 0,
                mergedResultDocument: {
                    $reduce: {
                        input: "$documents",
                        initialValue: {},
                        in: {
                            $mergeObjects: [
                                "$$value",
                                {
                                    $arrayToObject: {
                                        $filter: {
                                            input: {
                                                $objectToArray: "$$this"
                                            },
                                            cond: {
                                                $ne: ["$$this.v", null]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]);

    if (mergedResults.length > 0) {

        // Supprimer les documents d'origine après fusion
        await MeteoriteLandingModel.deleteMany({
            "properties.name": { $in: mergedResults.map(result => result.mergedResultDocument.properties.name) }
        });

        // Insérer les documents fusionnés
        await MeteoriteLandingModel.insertMany(mergedResults.map(result => result.mergedResultDocument));

        return {
            message: `${mergedResults.length} nouveaux documents ont été créés par merging des documents doublons. Les documents doublons d'origine ont été supprimés de la collection.`,
            mergedResults: mergedResults
        };

    } else {

        return {
            message: "Après vérification, aucun document ne fait doublon avec un autre dans la collection. Aucun nouveau document n'a donc été créé."
        }
    }
}


// DELETE

export async function clearMeteoriteLandingsCollection() {

    try {

        await MeteoriteLandingModel.deleteMany({});

        return {
            success: true,
            message: "Tous les documents de la collection meteorite_landings ont été supprimés."
        }

    } catch (err) {
        throw new Error(`Erreur lors de l'effacement de l'intégralité des documents de la collection meteorite_landings: ${err}`);
    }
}




// TESTS

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
