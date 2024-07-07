const fs = require("fs");

function matchSchema(obj, schema) {
    let matchedObj = {};

    for (let key in obj) {
        if (key in schema) {
            if (typeof obj[key] === schema[key]) {
                matchedObj[key] = obj[key];
            }
        }
    }

    return matchedObj;
}

function schemaRequirements(obj, schema) {
    let unmatchedFields = [];

    for (let key in schema) {
        if (!(key in obj)) {
            unmatchedFields.push(key);
        }
    }

    return unmatchedFields;
}

function log(file, message, format="text") {
    let content = message;

    if (format === "json") {
        content = JSON.stringify(message, null, 4);
    }

    let logsPath = `./logs/${file}.log`;
    fs.writeFileSync(logsPath, content, "utf8", () => {});
}

function parseAIJSON(aiResponseRaw) {
    if (aiResponseRaw.startsWith("```json")) {
        aiResponseRaw = aiResponseRaw.split("```json");
        aiResponseRaw.shift();
        aiResponseRaw = aiResponseRaw.join("```json");

        aiResponseRaw = aiResponseRaw.split("```");
        aiResponseRaw.pop();
        aiResponseRaw = aiResponseRaw.join("```");
    }
    
    let aiResponse;

    try {
        aiResponse = JSON.parse(aiResponseRaw);
    } catch (error) {
        aiResponse = {
            "role": "system",
            "message": "There was an error parsing the AI response. Please try again.",
            "actions": []
        }
    }

    return aiResponse;
}

module.exports = {
    matchSchema,
    schemaRequirements,
    log,
    parseAIJSON
}