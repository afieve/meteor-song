"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMeteoriteClassificationMindatID = validateMeteoriteClassificationMindatID;
function validateMeteoriteClassificationMindatID(classification) {
    const mindatIDRegex = /^\d{3,6}$/;
    if (classification.mindatID) {
        return mindatIDRegex.test(classification.mindatID.toString());
    }
    else {
        return true;
    }
}
//# sourceMappingURL=MeteoriteClassification.js.map