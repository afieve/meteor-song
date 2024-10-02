import { IClassificationFilterEntry } from "./Classification";

export interface Filters {
    classification: IClassificationFilterEntry[];
    massRange: [number, number];
    yearRange: [number, number];
}