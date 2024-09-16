export interface MeteoriteClassification {
    name: {
        eng: string;
        fr: string;
    }
    abbrvs: string[];
    mindatID: number;
    children: MeteoriteClassification[];
}

