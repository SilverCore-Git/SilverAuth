/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const Jimp = require("jimp");

async function GetHeadbySkin(skinPath, outputPath) {
    try {
        // Charger l'image
        const image = await Jimp.read(skinPath);

        // Extraire la tête (8x8 à partir de 8,8)
        const head = image.clone().crop(8, 8, 8, 8);

        // Redimensionner en 256x256
        head.resize(256, 256, Jimp.RESIZE_NEAREST_NEIGHBOR);

        // Sauvegarder l'image
        await head.writeAsync(outputPath);

        console.log(`✅ Tête extraite et enregistrée sous : ${outputPath}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'extraction :", error);
    }
}

module.exports = GetHeadbySkin;
