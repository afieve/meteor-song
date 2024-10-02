import { IClassification } from "../db/model/ClassificationModel";
import chroma, {Color, Scale} from 'chroma-js';
import { getFullClassificationTreeFromCollection } from "./ClassificationsService";

/*
const baseColors = {
    "Pierreuses": "#1f77b4", // Bleu
    "Ferreuses": "#d62728", // Rouge
    "Reliques": "#ffbb78", // Jaune
    "Mixtes": "#9467bd"   // Violet
};
*/
/*
export const generateColors = async () => {

    // const classifications = await ClassificationModel.find();
    // console.log(classifications);

    try {

        const classificationsTree = await getFullClassificationTreeFromCollection();

        classificationsTree.children.forEach(classification => {
            const baseColor = getBaseColor(classification);
            assignColors(classification, 0, baseColor);
        })

        return classificationsTree;
    
    } catch (err) {
        throw new Error(err);
    }
}
*/
/*
// Fonction récursive pour assigner une couleur en fonction de la profondeur dans l'arbre
function assignColors(classification, depth = 0, baseColor = '#000000') {
    // Calculer une nuance en fonction de la profondeur (plus la profondeur est grande, plus la couleur est foncée)
    const color = chroma(baseColor).brighten(depth * 0.5).hex();

    // Assigner la couleur à la classification
    classification.color = color;

    // Si la classification a des enfants, répéter le processus pour chaque enfant
    if (classification.children) {
        classification.children.forEach(child => {
            assignColors(child, depth + 1, baseColor);
        });
    }
}
*/
/*
// Fonction pour déterminer la couleur de base en fonction de la catégorie principale
function getBaseColor(classification) {
    if (classification.name.eng.includes("Stony")) {
        return baseColors.Pierreuses;
    } else if (classification.name.eng.includes("Iron")) {
        return baseColors.Ferreuses;
    } else if (classification.name.eng.includes("Relic")) {
        return baseColors.Reliques;
    } else if (classification.name.eng.includes("Mixed")) {
        return baseColors.Mixtes;
    }
    return '#000000'; // Couleur par défaut si la classification n'est pas trouvée
}
*/
/*
export const generateColorsPreviewTable = async () => {


    try {
        const classifications = await generateColors();

        let tableRows = '';

        classifications.forEach((classification) => {

            const hexColor = chroma.scale('Spectral')(Math.random()).hex();
            const rgbColor = chroma(hexColor).rgb().join();

            tableRows += `
                <tr>
                    <td>
                        <div style="background-color: ${hexColor}; width:20px; height:20px;"></div>
                    </td>
                    <td>${classification.name.fr}</td>
                    <td>${hexColor}</td>
                    <td>${rgbColor}</td>
                </tr>
            `;
        })

        const htmlDoc = `
        <html>
            <head>
               <title>Meteorite Colors </title>
                <style>
                    table {
                        width: 50 %;
                        margin: 20px auto;
                        border - collapse: collapse;
                    }
                    th, td {
                        padding: 10px;
                        border: 1px solid #ddd;
                        text - align: center;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;" > Meteorite Classification Colors </h1>
                <table>
                    <thead>
                        <tr>
                            <th>Aperçu</th>
                            <th>Classification</th>
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
        return htmlDoc;

    } catch (err) {
        throw new Error(err);
    }

}
*/

interface SingleClassificationColorData {
    name: string;
    hex: string;
    rgb: [number, number, number];
}


// Fonction principale pour générer la table HTML avec les couleurs
export const getHTMLColorTable = async () => {
    try {
        const classifications = await getFullClassificationTreeFromCollection();
        
        // Générer les couleurs
        const colorsData = generateColorsForClassifications(classifications);
        
        // Générer la table HTML
        const htmlTable = buildColorsTable(colorsData);

        return htmlTable;

    } catch (error) {
        console.error('Error generating color table:', error);
    }
};

// Fonction pour générer les couleurs pour chaque classification
function generateColorsForClassifications(classifications: IClassification) {
    const baseColors: Record<string, Scale<Color>> = {
        Stony: chroma.scale(['lightblue', 'darkblue']),
        Iron: chroma.scale(['#FFCCCB', 'darkred']),
        Relict: chroma.scale(['#FFFFE0', '#FFC300']),
        Mixed: chroma.scale(['#CBC3E3', '#900C3F'])
    };

    const colorsData: Array<SingleClassificationColorData> = [];

    // Fonction récursive pour assigner les couleurs
    const assignColorRecursively = (classification: IClassification, parentColorScale: Scale<Color>, depth: number) => {
        // Calcul de l'indice pour la couleur
        const total = classification.children ? classification.children.length : 1;
        const colorHex = parentColorScale(depth / (total + 1)).hex(); // +1 pour ajuster l'indice
        const colorRGB = chroma(colorHex).rgb();

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
                const childColorScale = chroma.scale(parentColorScale.colors(classification.children.length)).mode('lab'); // Créer une nouvelle échelle dérivée de la couleur parent

                // Appel récursif pour chaque enfant, avec la nouvelle échelle de couleur
                assignColorRecursively(child, childColorScale, childIndex + 1);
            });
        }
    };

    // Démarrer l'assignation des couleurs à partir de la racine
    classifications.children?.forEach((classification, index) => {
        const colorScale = baseColors[classification.name.eng] || baseColors.Mixed;
        assignColorRecursively(classification, colorScale, 1); // Commencer à la profondeur 1
    });

    return colorsData;
}

// Fonction pour générer la table HTML à partir des données de couleur
export const buildColorsTable = (colorsData: Array<SingleClassificationColorData>): string => {
    
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