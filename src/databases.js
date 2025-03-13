/**
 * @author SilverCore
 * @author SilverTransfer
 * @author MisterPapaye
 */

const fs = require("fs");
const crypto = require('crypto');




class dbManager {

    constructor(dbFile) {

      this.dbFile = dbFile;

    }
  
    static getCurrentDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
  
    static getCurrentTime() {
      return new Date().toLocaleTimeString("fr-FR", { hour12: false });
    }
  
    loadDatabase() {
      try {
        if (!fs.existsSync(this.dbFile)) return {}; // Si le fichier n'existe pas, retourner un objet vide
        return JSON.parse(fs.readFileSync(this.dbFile, "utf8"));
      } catch (error) {
        console.error(`❌ Erreur lors du chargement de la base de données ${this.dbFile}:`, error);
        return {};
      }
    }
  
    saveDatabase(data) {
      try {
        fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 4));
        console.log(`✅ Base de données (${this.dbFile}) mise à jour !`);
      } catch (error) {
        console.error(`❌ Erreur lors de la sauvegarde de ${this.dbFile}:`, error);
      }
    }
  
    async deleteFiledb(fileID) {
      let data = this.loadDatabase();
  
      if (!data[fileID]) {
        console.log(`⚠️ L'entrée "${fileID}" n'existe pas dans la base de données.`);
        return;
      }
  
      delete data[fileID]; // Supprimer l'entrée
      this.saveDatabase(data); // Sauvegarder la mise à jour
  
      console.log(`🗑️ Entrée supprimée dans ${this.dbFile} : ${fileID}`);
    }
  
    async resetDatabase() {
      const h = await DatabaseManager.getCurrentTime();
      const d = await DatabaseManager.getCurrentDate();
      const date = `${d} - ${h}`;
  
      try {
        await fs.promises.unlink(this.dbFile);
  
        await fs.promises.writeFile(this.dbFile, 
  `{
      "DBinfo": {
          "CreateDate": "${date}",
          "Path": "${this.dbFile}",
          "id": "${Math.floor(Math.random() * 9000) + 1000}"
      }
  }`);
  
        console.log(`🗑️ Base de données (${this.dbFile}) réinitialisée !`);
      } catch (error) {
        console.error(`❌ Erreur lors de la réinitialisation de ${this.dbFile}:`, error);
      }
    }
  
    async deleteDatabaseFile() {
      try {
        if (fs.existsSync(this.dbFile)) {
          await fs.unlinkSync(this.dbFile);
          console.log(`🚮 Fichier de base de données (${this.dbFile}) supprimé !`);
        } else {
          console.log(`⚠️ Le fichier de base de données ${this.dbFile} n'existe pas.`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression du fichier ${this.dbFile}:`, error);
      }
    }
  
    async createDatabaseFile() {
      try {
        await fs.promises.writeFile(this.dbFile, "");
        console.log(`✅ Fichier de base de données (${this.dbFile}) créé !`);
      } catch (error) {
        console.error(`❌ Erreur lors de la création du fichier ${this.dbFile}:`, error);
      }
    }
  }

module.exports = { dbManager }