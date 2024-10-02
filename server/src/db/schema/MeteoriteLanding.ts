export interface IMeteoriteLandingGeoJSONGeometry {
    type: string;
    coordinates: [number, number];
}
export interface IMeteoriteLandingGeoJSONProperties {
    name: string;
    recclass: string | null;
    mass: number | null;
    fall: string | null;
    year: number;
    datastroID: number | null;
    countryCode: string | null;
    country: string | null;
    departementFR: string | null;
}

export interface IMeteoriteLandingGeoJSONDocument {
    type: string;
    geometry: IMeteoriteLandingGeoJSONGeometry;
    properties: IMeteoriteLandingGeoJSONProperties;
}