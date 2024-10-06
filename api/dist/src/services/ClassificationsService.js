"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAndInsertFullClassificationTreeInDBCollection = generateAndInsertFullClassificationTreeInDBCollection;
exports.getFullClassificationTreeFromCollection = getFullClassificationTreeFromCollection;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const classifications_tree_json_1 = __importDefault(require("../../data/raw-data/classifications_tree.json"));
const ClassificationModel_1 = __importDefault(require("../db/model/ClassificationModel"));
// CREATE
async function generateAndInsertFullClassificationTreeInDBCollection() {
    try {
        // Sauvegarder l'état actuel de la base de données vers un fichier JSON
        await saveCollectionToANewJSONFile();
        console.log("Sauvegarde de la collection complétée.");
        // Effacement de tous les documents de la collection `classifications` de la base de données
        await deleteAllDocumentsFromCollection();
        console.log("Tous les documents de la collection `classifications` ont été supprimés avec succès.");
        // Extraction des données du fichier JSON (voir import dans les 1ères lignes de ce fichier)
        const jsonFileData = await getClassificationsTreeFromJSONFile();
        console.log("Données de classification arborescente récupérée: Classification racine:", jsonFileData);
        // Génération et insertion récursive des classifications de l'arbre, dans une hiérarchie document/sous-document
        await insertClassificationInDBCollection(jsonFileData, null, []);
        console.log("Insertion des documents dans la collection `classifications` complétée avec succès.");
        return {
            message: "Les données de classifications ont été générées sous forme de documents / sous-documents, et ajoutées à la collection MongoDB avec succès."
        };
    }
    catch (err) {
        console.log("Erreur dans generateAndInsertFullClassificationTreeInDBCollection:", err);
    }
}
async function insertClassificationInDBCollection(classificationData, parentId = null, pathArray = []) {
    /**
        *  La logique ici est de créer un document représentant la classification racine ("Météorite") & de l'insérer dans la collection, ce qui lui confère un ObjectId (id d'un document dans MongoDB).
        *  On fait ensuite la même opération de création-insertion avec chacun de ses enfants. S'ils ont un parent (au moins un, c'est-à-dire la classification racine), on cible ce parent grâce à son ObjectId, et on lui injecte les ObjectId de ses enfants dans son attribut children.
        *  On obtient alors la collection où chaque classification référence:
    */
    const { name, description, label, classCodes, regex, exclude, mindat_id, children } = classificationData;
    const classification = new ClassificationModel_1.default({
        name,
        description,
        label,
        classCodes,
        regex,
        exclude,
        mindat_id,
        parent: parentId,
        path: [...pathArray, parentId].filter(id => id !== null),
        children: []
    });
    // Insérer le document courant dans la collection
    await classification.save();
    // Insérer les enfants récursivement
    for (const child of children || []) {
        await insertClassificationInDBCollection(child, classification._id, [...pathArray, classification._id]);
    }
    // Mettre à jour le champ `children` du parent avec les IDs des enfants
    if (parentId) {
        await ClassificationModel_1.default.findByIdAndUpdate(parentId, { $push: { children: classification._id } });
    }
}
async function saveCollectionToANewJSONFile() {
    console.log("Lancement de la procédure de sauvegarde de la collection `classifications`...");
    const collection = await ClassificationModel_1.default.find({});
    console.log("Collection `classifications` récupérée:", collection.length, "documents contenus dans la collection.");
    const jsonData = JSON.stringify(collection);
    console.log("Données (documents) converties en JSON string.");
    const collectionName = "classifications";
    const timestamp = Date.now();
    const filename = `${collectionName}-${timestamp}`;
    const destDir = path_1.default.join(process.cwd(), "data", "saves", "collection", collectionName);
    const filepath = `${destDir}/${filename}.json`;
    try {
        await promises_1.default.mkdir(destDir, { recursive: true });
        console.log("Le répertoire de sauvegarde a été créé, ou existait déjà.");
        await promises_1.default.writeFile(filepath, jsonData);
        console.log("Fichier de sauvegarde créé avec succès:", filepath);
    }
    catch (err) {
        console.error(`Erreur lors de la création du fichier de sauvegarde ${filepath}:`, err);
        throw err;
    }
}
// READ
async function getClassificationsTreeFromJSONFile() {
    return await classifications_tree_json_1.default;
}
async function getClassificationChildrenFromCollection(parentId) {
    const children = await ClassificationModel_1.default.find({ parent: parentId, exclude: { $ne: true } }).lean();
    const result = await Promise.all(children.map(async (child) => {
        const childData = {};
        childData.uuid = (0, uuid_1.v4)();
        if (child.name)
            childData.name = child.name;
        if (child.description)
            childData.description = child.description;
        if (child.label)
            childData.label = child.label;
        if (child.classCodes)
            childData.classCodes = child.classCodes;
        if (child.regex)
            childData.regex = child.regex;
        if (child.mindat_id)
            childData.mindat_id = child.mindat_id;
        if (child.mindat_example_photo_id)
            childData.mindat_example_photo_id = child.mindat_example_photo_id;
        if (child.children)
            childData.children = await getClassificationChildrenFromCollection(child._id);
        return childData;
    }));
    return result;
}
async function getFullClassificationTreeFromCollection() {
    console.log("Obtention de l'arbre complet des classifications depuis la collection `classifications`");
    try {
        const rootClassification = await ClassificationModel_1.default.findOne({ "name.eng": "Meteorite" }).lean();
        if (!rootClassification) {
            throw new Error("Root classification not found");
        }
        const fullTree = {};
        if (rootClassification.name)
            fullTree.name = rootClassification.name;
        if (rootClassification.description)
            fullTree.description = rootClassification.description;
        if (rootClassification.classCodes)
            fullTree.classCodes = rootClassification.classCodes;
        if (rootClassification.children)
            fullTree.children = await getClassificationChildrenFromCollection(rootClassification._id);
        return fullTree;
    }
    catch (err) {
        console.log(err);
        throw new Error("Error retrieving classification tree");
    }
}
// DELETE
async function deleteAllDocumentsFromCollection() {
    try {
        await ClassificationModel_1.default.deleteMany({});
        return;
    }
    catch (err) {
        console.error("Erreur lors de la suppression de tous les documents de la collection", err);
        throw err;
    }
}
//# sourceMappingURL=ClassificationsService.js.map