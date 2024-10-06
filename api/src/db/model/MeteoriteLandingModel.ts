import mongoose, { Schema } from "mongoose";

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
    nametype: string | null;
}

export interface IMeteoriteLandingGeoJSONDocument {
    type: string;
    geometry: IMeteoriteLandingGeoJSONGeometry;
    properties: IMeteoriteLandingGeoJSONProperties;
}

const MeteoriteLandingGeoJSONGeometrySchema = new Schema<IMeteoriteLandingGeoJSONGeometry>({
    type: { type: String, required: true },
    coordinates: { type: [Number, Number], required: true },
}, {_id: false});

const MeteoriteLandingsGeoJSONPropertiesSchema = new Schema<IMeteoriteLandingGeoJSONProperties>({
    name: { type: String, required: true },
    recclass: { type: String, required: true },
    mass: { type: Number, required: false, default: null },
    fall: { type: String, required: false, default: null },
    year: { type: Number, required: false, default: null },
    datastroID: { type: Number, required: true },
    country: { type: String, required: false, default: null },
    countryCode: { type: String, required: false, default: null },
    departementFR: { type: String, required: false, default: null },
    nametype: { type: String, required: true },
}, {_id: false});

const MeteoriteLandingSchema = new Schema<IMeteoriteLandingGeoJSONDocument>({
    type: { type: String, required: true },
    geometry: { type: MeteoriteLandingGeoJSONGeometrySchema, required: false, default: null },
    properties: { type: MeteoriteLandingsGeoJSONPropertiesSchema, required: true }
});

// Création du modèle avec une interface TypeScript pour les types statiques
export interface MeteoriteLandingDocument extends IMeteoriteLandingGeoJSONDocument, mongoose.Document { }

// Modèle Mongoose
const MeteoriteLandingModel = mongoose.model<MeteoriteLandingDocument>('meteorite_landings', MeteoriteLandingSchema);

export default MeteoriteLandingModel;