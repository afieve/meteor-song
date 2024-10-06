export type GeoLocation = {
    lat: number;
    lon: number;
}

export type Country = {
    name: string;
    countryCode: string;
}

export interface IMeteoriteLandingSchema {
    name: string;
    year: number;
    mass: number;
    recclass: string;
    reclat: number;
    reclong: number;
    fall: string;
    geolocation: GeoLocation;
    datastroID: number;
    country: string;
    countryCode: string;
    departementFR: string;
}

