/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


const sharp = require("sharp");

async function GetHeadbySkin(skinPath, outputPath) {

    try {

        await sharp(skinPath)
            .extract({ left: 8, top: 8, width: 8, height: 8 })
            .resize(256, 256, { 
                kernel: sharp.kernel.nearest,
                fit: sharp.fit.contain,
            })
            .toFile(outputPath);

        console.log(`✅ Tête extraite et enregistrée sous : ${outputPath}`);

    } catch (error) {

        console.error("❌ Erreur lors de l'extraction :", error);

    }

}

module.exports = GetHeadbySkin;
