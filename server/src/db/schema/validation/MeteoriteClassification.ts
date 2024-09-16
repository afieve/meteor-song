import { IMeteoriteClassificationSchema } from "../MeteoriteClassification";

export function validateMeteoriteClassificationMindatID(classification: IMeteoriteClassificationSchema) : boolean {
    const mindatIDRegex = /^\d{3,6}$/;
    if (classification.mindatID) {
        return mindatIDRegex.test(classification.mindatID.toString());
    } else {
        return true;
    }
}