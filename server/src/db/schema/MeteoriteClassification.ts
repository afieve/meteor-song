export interface IMeteoriteClassificationSchema {
    name: {
        eng?: string;
        fr?: string;
    }
    recclass?: string[];
    mindatID?: number;
    children?: IMeteoriteClassificationSchema[];
}