export interface IMeteoriteLandingGeoJSONGeometry {
    type?: string;
    coordinates?: [number, number];
}
export interface IMeteoriteLandingGeoJSONProperties {
    uuid?: string;
    name?: string;
    recclass?: string;
    mass?: number;
    fall?: string;
    year?: number;
    datastroID?: number;
    countryCode?: string;
    country?: string | null;
    departementFR?: string | null;
}

export interface IMeteoriteLandingGeoJSONDocument {
    type: string;
    geometry: IMeteoriteLandingGeoJSONGeometry;
    properties: IMeteoriteLandingGeoJSONProperties;
}