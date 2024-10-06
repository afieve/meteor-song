// import { IMeteoriteLandingSchema } from "../../../types/IMeteoriteLandingSchema";
import { IMeteoriteLandingGeoJSONDocument, IMeteoriteLandingGeoJSONGeometry, IMeteoriteLandingGeoJSONProperties } from "../../model/MeteoriteLandingModel";

/*//! Ce validateur n'est pas au point, 
//! il doit valider les valeurs même si elles sont nulles
*/

export class MeteoriteLandingValidator implements IMeteoriteLandingGeoJSONDocument {
    type: string;
    geometry: IMeteoriteLandingGeoJSONGeometry;
    properties: IMeteoriteLandingGeoJSONProperties;

    constructor(meteoriteLanding: IMeteoriteLandingGeoJSONDocument) {
        this.type = meteoriteLanding.type;
        this.geometry = meteoriteLanding.geometry;
        this.properties = meteoriteLanding.properties;
    }
    // Comprendre `this.type` comme étant l'attribut "type" du GeoJSON
    private validateType(): boolean {
        if ((this.type !== "Feature") 
            || (typeof this.type !== "string")) 
        {
            return false;
        } else {
            return true;
        }
    }

    private validateGeometry(): boolean {
        const { type, coordinates } = this.geometry;
        if ((type !== "Point")
            || (typeof type !== "string")
            || (typeof coordinates !== "object")
            || (coordinates.length !== 2)
            || (typeof coordinates[0] !== "number")
            || (typeof coordinates[1] !== "number")
        ) {
            return false;
        } else {
            return true
        }
    }

    private validateProperties(): boolean {
        const { name, recclass, mass, fall, year, datastroID, countryCode, country, departementFR } = this.properties;
        const yearRegex = /^\d{4}$/;
        const maxMass = 65000000;
        const fallStatuses = ["Fell", "Found"];
        // Voir le fichier /destruct-test.js pour comprendre comment fonctionne le destructuring sur un objet JS, et pourquoi on peut se permettre ces conditions ci-dessous: car JS affectera la valeur undefined aux variables dont le nom correspond à des clés qui n'existent pas dans l'objet destructuré ci-dessus.
        if (
            ((typeof name === "string" && name.split('').length <= 60) || name === null)
            && ((typeof recclass === "string" && recclass.split('').length <= 40) || recclass === null)
            && ((typeof mass === "number" && mass <= maxMass) || mass === null)
            && ((typeof fall === "string" && fallStatuses.includes(fall)) || fall === null)
            && ((typeof year === "number" && yearRegex.test(year.toString())) || year === null)
            && (typeof datastroID === "number" || datastroID === null)
            && ((typeof countryCode === "string" && countryCode.split('').length <= 3) || countryCode === null)
            && ((typeof country === "string" && country.split('').length <= 70) || country === null)
            && ((typeof departementFR === "string" && departementFR.split('').length <= 35) || departementFR === null)
        ) {
            return true;
        } else {
            return false;
        }
    }
    public get validate(): boolean {
        if (this.validateType && this.validateGeometry && this.validateProperties) {
            return true;
        } else {
            return false;
        }
    }
}