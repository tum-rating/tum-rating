import fs from "fs";
import * as path from "node:path";

const sanitizeFilename = (filename) => {
    return filename
        .replaceAll(":", "-")
        .replaceAll("*", "-")
        .replaceAll("?", "-")
        .replaceAll('"', "-")
        .replaceAll("<", "-")
        .replaceAll(">", "-")
        .replaceAll("|", "-")
        .replaceAll("\\", "-");
};

const saveFile = (filename, data) => {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
    const sanitizedFilename = sanitizeFilename(filename);
    fs.writeFileSync(sanitizedFilename, JSON.stringify(data), "utf8");
    console.info(`Data saved to ${sanitizedFilename}`);
};

export {sanitizeFilename, saveFile};
