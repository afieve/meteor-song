
export interface IClassificationName {
    eng?: string;
    fr?: string;
}
export interface IClassificationDescription {
    eng?: string;
    fr?: string;
}
export interface IClassificationLabel {
    eng?: string;
    fr?: string;
}
export interface IClassificationRegex {
    self?: string;
    children?: string;
    selfAndChildren?: string;
}
export interface IClassification {
    uuid?: string;
    name?: IClassificationName;
    description?: IClassificationDescription;
    label?: IClassificationLabel;
    classCodes?: string[];
    regex?: IClassificationRegex;
    mindat_id?: string;
    mindat_example_photo_id?: string;
    children?: IClassification[];
}
export type IClassificationFilterEntry = {
    uuid: IClassification['uuid'];
    classCodes: IClassification['classCodes'];
}