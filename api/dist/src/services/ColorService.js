"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildColorsTable = exports.getHTMLColorTable = void 0;
const chroma_js_1 = __importDefault(require("chroma-js"));
const ClassificationsService_1 = require("./ClassificationsService");
// Fonction principale pour générer la table HTML avec les couleurs
const getHTMLColorTable = async () => {
    try {
        const classifications = await (0, ClassificationsService_1.getFullClassificationTreeFromCollection)();
        // Générer les couleurs
        const colorsData = generateColorsForClassifications(classifications);
        // Générer la table HTML
        const htmlTable = (0, exports.buildColorsTable)(colorsData);
        return htmlTable;
    }
    catch (error) {
        console.error('Error generating color table:', error);
    }
};
exports.getHTMLColorTable = getHTMLColorTable;
// Fonction pour générer les couleurs pour chaque classification
function generateColorsForClassifications(classifications) {
    var _a;
    const baseColors = {
        Stony: chroma_js_1.default.scale(['lightblue', 'darkblue']),
        Iron: chroma_js_1.default.scale(['#FFCCCB', 'darkred']),
        Relict: chroma_js_1.default.scale(['#FFFFE0', '#FFC300']),
        Mixed: chroma_js_1.default.scale(['#CBC3E3', '#900C3F'])
    };
    const colorsData = [];
    // Fonction récursive pour assigner les couleurs
    const assignColorRecursively = (classification, parentColorScale, depth) => {
        // Calcul de l'indice pour la couleur
        const total = classification.children ? classification.children.length : 1;
        const colorHex = parentColorScale(depth / (total + 1)).hex(); // +1 pour ajuster l'indice
        const colorRGB = (0, chroma_js_1.default)(colorHex).rgb();
        // Assignation de la couleur pour la classification actuelle
        colorsData.push({
            name: classification.name.eng,
            hex: colorHex,
            rgb: colorRGB
        });
        // Parcours des classifications enfants si elles existent
        if (classification.children) {
            classification.children.forEach((child, childIndex) => {
                // Détermination de l'échelle de couleur selon la classification parent
                const childColorScale = chroma_js_1.default.scale(parentColorScale.colors(classification.children.length)).mode('lab'); // Créer une nouvelle échelle dérivée de la couleur parent
                // Appel récursif pour chaque enfant, avec la nouvelle échelle de couleur
                assignColorRecursively(child, childColorScale, childIndex + 1);
            });
        }
    };
    // Démarrer l'assignation des couleurs à partir de la racine
    (_a = classifications.children) === null || _a === void 0 ? void 0 : _a.forEach((classification, index) => {
        const colorScale = baseColors[classification.name.eng] || baseColors.Mixed;
        assignColorRecursively(classification, colorScale, 1); // Commencer à la profondeur 1
    });
    return colorsData;
}
// Fonction pour générer la table HTML à partir des données de couleur
const buildColorsTable = (colorsData) => {
    console.log(colorsData);
    const tableRows = colorsData.map((data) => `
        <tr>
            <td><span>${data.name}</span></td>
            <td><div style="width: 50px; height: 20px; background-color: ${data.hex};"></div></td>
            <td><span>${data.hex}</span></td>
            <td><span>rgb(${data.rgb.join(', ')})</span></td>
        </tr>
    `).join('');
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Meteorite Classifications Colors</title>
        </head>
        <body>
            <h1>Classification Colors</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Classification</th>
                        <th>Aperçu</th>
                        <th>HEX</th>
                        <th>RGB</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </body>
        </html>
    `;
};
exports.buildColorsTable = buildColorsTable;
//# sourceMappingURL=ColorService.js.map