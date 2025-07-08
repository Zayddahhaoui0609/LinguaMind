const fs = require('fs');
const path = require('path');

// Define paths based on the new project structure
const dataDir = path.join(__dirname, '..', 'data');
const publicDir = path.join(__dirname, '..', 'public');
const outputFile = path.join(publicDir, 'languageData.json');

const allLanguageData = {};

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.readdir(dataDir, (err, files) => {
    if (err) {
        return console.error('Error reading data directory:', err);
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
        return console.log('No JSON files found in the data directory.');
    }
    
    let filesProcessed = 0;

    jsonFiles.forEach(file => {
        const filePath = path.join(dataDir, file);
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                console.error(`Error reading file ${file}:`, err);
                // Even if a file fails, we need to make sure we eventually write the output
                filesProcessed++;
                if (filesProcessed === jsonFiles.length) {
                    writeOutputFile();
                }
                return;
            }

            try {
                const data = JSON.parse(content);
                // Normalize the language key from the filename
                const langKey = path.basename(file, '.json').replace('_transformed', '');
                
                // Handle different possible JSON structures
                if (Array.isArray(data)) {
                    allLanguageData[langKey] = data;
                } else if (data.words && Array.isArray(data.words)) {
                    allLanguageData[langKey] = data.words;
                } else {
                     // Assume the whole object is the data if it's not a recognized structure
                     allLanguageData[langKey] = data;
                }
            } catch (parseErr) {
                console.error(`Error parsing JSON from ${file}:`, parseErr);
            }

            filesProcessed++;
            if (filesProcessed === jsonFiles.length) {
                writeOutputFile();
            }
        });
    });

    function writeOutputFile() {
        fs.writeFile(outputFile, JSON.stringify(allLanguageData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return console.error('Error writing combined data file:', writeErr);
            }
            console.log(`Successfully created ${outputFile}`);
        });
    }
});
