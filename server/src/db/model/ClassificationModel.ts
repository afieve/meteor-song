import mongoose, { Schema } from "mongoose";

export interface IClassificationName {
    eng?: string | null;
    fr?: string | null;
}
export interface IClassificationDescription {
    eng?: string | null;
    fr?: string | null;
}
export interface IClassificationRegex {
    self?: string;
    children?: string;
    selfAndChildren?: string;
}
export interface IClassificationLabel {
    eng?: string | null;
    fr?: string | null;
}
export interface IClassification {
    uuid?: string;
    name?: IClassificationName | null;
    description?: IClassificationDescription | null;
    label?: IClassificationLabel | null;
    classCodes?: string[] | null;
    regex?: IClassificationRegex;
    exclude?: boolean;
    mindat_id?: string | null;
    mindat_example_photo_id?: string | null;
    children?: IClassification[];
}

const ClassificationNameSchema: Schema = new Schema<IClassificationName>({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, {_id:false});
const ClassificationDescriptionSchema: Schema = new Schema<IClassificationDescription>({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, {_id:false});
const ClassificationRegexSchema: Schema = new Schema<IClassificationRegex>({
    self: {type: String, required: false},
    children: {type: String, required: false},
    selfAndChildren: {type: String, required: false},
}, {_id:false});
const ClassificationLabelSchema: Schema = new Schema<IClassificationName>({
    eng: { type: String, required: false },
    fr: { type: String, required: false }
}, {_id:false});

const ClassificationSchema: Schema = new Schema({
    name: { type: ClassificationNameSchema, required: true },
    description: { type: ClassificationDescriptionSchema, required: false },
    label: {type: ClassificationLabelSchema, required: false},
    classCodes: { type: [String], required: false },
    regex: {type: ClassificationRegexSchema, required: false},
    exclude: {type: Boolean, required: false},
    mindat_id: { type: String, required: false },
    parent: { type: Schema.Types.ObjectId, ref: 'Classification', required: false },
    path: [{ type: Schema.Types.ObjectId, ref: 'Classification', required: false }],
    children: [{ type: Schema.Types.ObjectId, ref: 'Classification', required: false }]
}, {
    timestamps: true,
    collection: 'classifications_new'
});

export interface ClassificationDocument extends IClassification, mongoose.Document {
    _id: mongoose.Types.ObjectId,
    parent: mongoose.Types.ObjectId | null;
}


const ClassificationModel = mongoose.model<IClassification>('Classification', ClassificationSchema);

export default ClassificationModel;
