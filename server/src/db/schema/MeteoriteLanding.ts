import mongoose, { Schema, Document } from 'mongoose';
// import { MeteoriteLanding } from '../../types/IMeteoriteLandingSchema';


export type Classification = {
    names: {
        eng: string;
        fr: string;
    };
    mindatID: number | null;
    children?: Classification;
}

export type GeoLocation = {
    lat: number;
    lon: number;
}

export type Country = {
    name: string;
    countryCode: string;
}


export interface IMeteoriteLandingDocument {
    name: string;
    year: number;
    mass: number;
    recclass: string;
    reclat: number;
    reclong: number;
    fall: string;
    geolocation: GeoLocation;x
    datastroID: number;
    country: string;
    countryCode: string;
    departementFR: string;
}

// Schéma pour GeoLocation
const GeoLocationSchema = new Schema<GeoLocation>({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
});


// Schéma pour MeteoriteLanding
const MeteoriteLandingSchema = new Schema<IMeteoriteLandingDocument>({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    mass: { type: Number, required: true },
    recclass: { type: String, required: true },
    reclat: { type: Number, required: true },
    reclong: { type: Number, required: true },
    fall: { type: String, required: true },
    geolocation: { type: GeoLocationSchema, required: true },
    datastroID: { type: Number, required: false },
    country: { type: String, required: false },
    countryCode: { type: String, required: false },
    departementFR: { type: String, required: false }
});

// Création du modèle avec une interface TypeScript pour les types statiques
export interface MeteoriteLandingDocument extends IMeteoriteLandingDocument, Document { }

// Modèle Mongoose
const MeteoriteLandingModel = mongoose.model<MeteoriteLandingDocument>('meteorite_landings', MeteoriteLandingSchema);

export default MeteoriteLandingModel;