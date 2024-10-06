"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MeteoriteLandingGeoJSONGeometrySchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    coordinates: { type: [Number, Number], required: true },
}, { _id: false });
const MeteoriteLandingsGeoJSONPropertiesSchema = new mongoose_1.Schema({
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
}, { _id: false });
const MeteoriteLandingSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    geometry: { type: MeteoriteLandingGeoJSONGeometrySchema, required: false, default: null },
    properties: { type: MeteoriteLandingsGeoJSONPropertiesSchema, required: true }
});
// Modèle Mongoose
const MeteoriteLandingModel = mongoose_1.default.model('meteorite_landings', MeteoriteLandingSchema);
exports.default = MeteoriteLandingModel;
//# sourceMappingURL=MeteoriteLandingModel.js.map