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
const ClassificationNameSchema = new mongoose_1.Schema({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, { _id: false });
const ClassificationDescriptionSchema = new mongoose_1.Schema({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, { _id: false });
const ClassificationRegexSchema = new mongoose_1.Schema({
    self: { type: String, required: false },
    children: { type: String, required: false },
    selfAndChildren: { type: String, required: false },
}, { _id: false });
const ClassificationLabelSchema = new mongoose_1.Schema({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, { _id: false });
const ClassificationSchema = new mongoose_1.Schema({
    name: { type: ClassificationNameSchema, required: true },
    description: { type: ClassificationDescriptionSchema, required: false },
    label: { type: ClassificationLabelSchema, required: false },
    classCodes: { type: [String], required: false },
    regex: { type: ClassificationRegexSchema, required: false },
    exclude: { type: Boolean, required: false },
    mindat_id: { type: String, required: false },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Classification', required: false },
    path: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Classification', required: false }],
    children: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Classification', required: false }]
}, {
    timestamps: true,
    collection: 'classifications_new'
});
const ClassificationModel = mongoose_1.default.model('Classification', ClassificationSchema);
exports.default = ClassificationModel;
//# sourceMappingURL=ClassificationModel.js.map