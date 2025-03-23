const fs = require('fs')
const path = require('path')

function readTextfile(filePath){
    try{
        return fs.readFileSync(filePath, 'utf8')
    }
    catch(err){
        console.error("Error reading file:",err)
        return null
    }   
}

function cleanedBurmeseText(text) {
    if(!text) return "";

    const emojiPattern = /🌐[\s\S]*$/;
    text = text.replace(emojiPattern, '').trim();

    let lines = text.split('\n');

    const lastLinesStarIndex = Math.max(0,lines.length - 3);
    for(let i=lines.length - 1; i >= lastLinesStarIndex; i--){
        if (
            lines[i].includes("ပုံစာ") ||
            lines[i].includes("ဓါတ်ပုံ") ||
            lines[i].includes("Photo") ||
            lines[i].includes("ဓာတ်ပုံ")
        ) {
            lines = lines.slice(0, i);
        }
    }

    // Find the first occurrence of the emoji
    // const emojiIndex = text.indexOf('🌐');
    // if (emojiIndex !== -1) {
    //     // Keep only the text before the emoji
    //     text = text.substring(0, emojiIndex).trim();
    // }

    // Split into paragraphs and filter metadata
    // let paragraphs = text.split('\n');
    // paragraphs = paragraphs.filter(para => {
    //     const trimmedPara = para.trim();
    //     return !(
    //         trimmedPara.endsWith("ပုံစာ") ||
    //         trimmedPara.endsWith("ဓါတ်ပုံ") ||
    //         trimmedPara.endsWith("Photo") ||
    //         trimmedPara.endsWith("ဓာတ်ပုံ")
    //     );
    // });

    // Remove extra blank lines and trim
    text = lines.join('\n').replace(/\n\s*\n/g, '\n').trim();

    return text;
}

// function cleanedBurmeseText(text){
//     if(!text) return "";

//     const emojiPattern = /🌐[\s\S]*$/;  // Match emoji 🌐 and everything after it (including newlines)
    
//     // Remove everything from the emoji 🌐 onwards
//     text = text.replace(emojiPattern, '').trim();

//     let lines = text.split('\n');
//     // if (lines.length > 0)
//     //     lines.shift();
//     // text = lines.join('\n');

//     // text = text.replace(/ပုံစာ.*?\n?/g, '');
//     // text = text.replace(/ဓါတ်ပုံ.*?\n?/g, '');
//     // // text = text.replace(/ရန်ကုန်.*?\n?/g, '');
//     // text = text.replace(/\n\s*\n/g, '\n');
//     // text = text.trim();

//     lines = lines.filter(line => !line.includes("ပုံစာ") && !line.includes("ဓါတ်ပုံ") && !line.includes("Photo") && !line.includes("ဓာတ်ပုံ"));

//     // Remove extra blank lines
//     text = lines.join('\n').replace(/\n\s*\n/g, '\n').trim();

//     return text;

//     // return text;

// }
function overwriteTextFile(filePath, text){
    try{
        fs.writeFileSync(filePath, text, 'utf8');
        console.log("File is saved successfully.")
    }catch(error){
        console.error("Error writing file:", error)
        
    }
}

const folderPath = __dirname;
const files = fs.readdirSync(folderPath);

files.forEach(file => {
    if (file.startsWith('Mawkun_') && file.endsWith('.txt')){

        const filePath = path.join(folderPath, file);
        const burmesetext = readTextfile(filePath);
        const cleanedtext = cleanedBurmeseText(burmesetext);

        if (cleanedtext){
            overwriteTextFile(filePath, cleanedtext);
            console.log("Cleaned content:", cleanedtext)
        }
    }
});
