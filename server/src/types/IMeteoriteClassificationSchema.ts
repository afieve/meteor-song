export interface MeteoriteClassification {
    name: {
        eng: string;
        fr: string;
    }
    classCodes: string[];
    mindatID: number;
    children: MeteoriteClassification[];
}

