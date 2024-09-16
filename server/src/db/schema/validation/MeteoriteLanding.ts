import { IMeteoriteLandingSchema } from "../../../types/IMeteoriteLandingSchema";

export function validateMeteoriteLandingYear(landing: IMeteoriteLandingSchema): boolean {
    const yearRegex = /^\d{4}$/;
    return yearRegex.test(landing.year.toString());
}
export function validateMeteoriteLandingMass(landing: IMeteoriteLandingSchema) : boolean {
    // la valeur comparée est supérieure de 5 tonnes à la météorite la plus massive jamais trouvée sur Terre
    return landing.mass <= 65000000;
}
export function validateMeteoriteLandingFall(landing: IMeteoriteLandingSchema) : boolean {
    return landing.fall === "Fell" || landing.fall === "Found";
}