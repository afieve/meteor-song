export interface IMeteoriteClassificationSchema {
    name: {
        eng: string;
        fr: string;
    }
    abbrvs: string[];
    mindatID: number;
    children: IMeteoriteClassificationSchema[];
}