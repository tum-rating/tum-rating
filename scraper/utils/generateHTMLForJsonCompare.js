import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generateHTML(jsonPaths) {
    const jsonData = jsonPaths.map((filePath, index) => {
        const data = fs.readFileSync(filePath, { encoding: 'utf8' });
        if (!data.trim()) {
            console.warn(`Warning: ${filePath} is empty.`);
            return `window.jsonData${index} = {};`; // Default to empty object
        }
        try {
            const json = JSON.parse(data);
            return `window.jsonData${index} = ${JSON.stringify(json)};`;
        } catch (error) {
            console.error(`Error parsing JSON from ${filePath}:`, error);
            return `window.jsonData${index} = {};`; // Default to empty object on error
        }
    }).join('\n');

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dynamic JSON Merger</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.5.6/jsoneditor.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/jsondiffpatch@0.6.0/lib/index.min.js" defer></script>
        <link href="https://cdn.jsdelivr.net/npm/jsondiffpatch@0.6.0/lib/formatters/styles/html.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.5.6/jsoneditor.min.css">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .json-editor-container {
                width: 30%;
                margin-right: 10px;
                margin-bottom: 20px;
            }
            .generatedJsonEditor{
                height: 300px;
            }
            #editors {
                display: flex;
                flex-wrap: wrap;
            }
            #diff {
                width: 100%;
                height: 300px;
                margin-top: 20px;
                border: 1px solid #ccc;
                padding: 10px;
                overflow: auto;
                background-color: #f9f9f9;
            }
            button {
                margin-top: 10px;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
        <div id="editors">
            ${jsonPaths.map((path, index) => `
                <div class="json-editor-container">
                    <h2>JSON ${index + 1}</h2>
                    <div id="jsonEditor${index}" class="generatedJsonEditor"></div>
                </div>
            `).join("")}
        </div>
        <button onclick="compareJson()">Compare JSONs</button>
        <div id="diff"></div>
        <button onclick="mergeJson()">Merge JSONs</button>
        <h4>Merged JSON</h4>
        <pre id="mergedJson"></pre>
        <script>
          ${jsonData}
        </script>
        <script>
            const jsonPaths = ${JSON.stringify(jsonPaths)};
            const jsonEditors = [];
    
            document.addEventListener('DOMContentLoaded', () => {
                jsonPaths.forEach((path, index) => {
                    const editorDiv = document.getElementById(\`jsonEditor\${index}\`);
                    const editor = new JSONEditor(editorDiv, {});
                    jsonEditors.push(editor);
                    
                    console.log(editor)
                    console.log(window[\`jsonData\${index}\`])
                    editor.set(window[\`jsonData\${index}\`]);
                });
            });
    
            function compareJson() {
                const jsons = jsonEditors.map(editor => editor.get());
                const baseJson = jsons[0];
                const diffContainer = document.getElementById('diff');
                diffContainer.innerHTML = '';
    
                for (let i = 1; i < jsons.length; i++) {
                    const delta = jsondiffpatch.diff(baseJson, jsons[i]);
                    const diffHtml = jsondiffpatch.formatters.html.format(delta, baseJson);
                    diffContainer.innerHTML += \`<h3>Difference with JSON \${i + 1}</h3>\${diffHtml}\`;
                }
            }
    
            function mergeJson() {
                const jsons = jsonEditors.map(editor => editor.get());
                const mergedJson = Object.assign({}, ...jsons);
                document.getElementById('mergedJson').textContent = JSON.stringify(mergedJson, null, 2);
            }
        </script>
    </body>
    </html>
    `;
    return html;
}


function generateHTMLForJSONCompare(jsonPaths) {
    const htmlContent = generateHTML(jsonPaths);

    fs.writeFile(path.join(__dirname, "index.html"), htmlContent, (err) => {
        if (err) {
            console.error("Error writing HTML file:", err);
        } else {
            console.log("HTML file has been saved.");
        }
    });
}

export { generateHTMLForJSONCompare };
