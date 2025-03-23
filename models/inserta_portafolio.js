//Este script permite insertar un portfolio en la base de datos del usuario
//Referenciado por su userId
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Portfolio from "./portfolio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

// Datos de las carteras
const portfolioData = {
  portfolios: [
    {
      name: "Tecnologica",
      stocks: [
        { ticker: "TSLA", title: "Tesla Inc.", price: 120, cantidad: 10 },
        { ticker: "AAPL", title: "Apple Inc.", price: 344, cantidad: 15 },
        { ticker: "MSFT", title: "Microsoft Corporation", price: 67, cantidad: 8 },
        { ticker: "GOOG", title: "Google", price: 1500, cantidad: 5 },
        { ticker: "AMZN", title: "Amazon", price: 2000, cantidad: 3 },
        { ticker: "FB", title: "Facebook", price: 350, cantidad: 12 },
        { ticker: "NVDA", title: "NVIDIA", price: 600, cantidad: 4 },
        { ticker: "AMD", title: "AMD", price: 100, cantidad: 7 },
        { ticker: "INTC", title: "Intel", price: 55, cantidad: 9 },
        { ticker: "TSM", title: "Taiwan Semiconductor", price: 90, cantidad: 6 },
      ],
    },
    {
      name: "Salud",
      stocks: [
        { ticker: "UNH", title: "UnitedHealth Group Inc.", price: 78, cantidad: 20 },
        { ticker: "CI", title: "Cigna Corporation", price: 56, cantidad: 25 },
        { ticker: "LH", title: "Laboratory Corporation of America", price: 67, cantidad: 15 },
        { ticker: "PFE", title: "Pfizer", price: 40, cantidad: 18 },
        { ticker: "JNJ", title: "Johnson & Johnson", price: 150, cantidad: 12 },
        { ticker: "MRK", title: "Merck", price: 80, cantidad: 16 },
        { ticker: "BMY", title: "Bristol-Myers Squibb", price: 70, cantidad: 14 },
        { ticker: "LLY", title: "Eli Lilly", price: 400, cantidad: 6 },
        { ticker: "GILD", title: "Gilead Sciences", price: 60, cantidad: 9 },
        { ticker: "AMGN", title: "Amgen", price: 215, cantidad: 5 },
      ],
    },
    {
      name: "Biotech",
      stocks: [
        { ticker: "GILD", title: "Gilead Sciences, Inc.", price: 45, cantidad: 10 },
        { ticker: "AMGN", title: "Amgen Inc.", price: 34, cantidad: 12 },
        { ticker: "MRNA", title: "Moderna, Inc.", price: 56, cantidad: 15 },
        { ticker: "VIR", title: "Vir Biotechnology", price: 50, cantidad: 18 },
        { ticker: "BNTX", title: "BioNTech", price: 120, cantidad: 7 },
        { ticker: "EDIT", title: "Editas Medicine", price: 30, cantidad: 25 },
        { ticker: "CRSP", title: "CRISPR Therapeutics", price: 60, cantidad: 22 },
        { ticker: "TSHA", title: "Taysha Gene Therapies", price: 35, cantidad: 10 },
        { ticker: "NTLA", title: "Intellia Therapeutics", price: 90, cantidad: 12 },
        { ticker: "ALNY", title: "Alnylam Pharmaceuticals", price: 180, cantidad: 5 },
      ],
    },
  ],
};

// 🔥 Aquí ponemos un 'userId' real que esté en la base de datos
const userId = "67a7c4cba0fbbcefea86135f";

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    return addPortfolios(userId, portfolioData); // 🔥 Insertamos todas las carteras
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Función para insertar todas las carteras
async function addPortfolios(userId, portfolioData) {
  try {
    console.log("📌 userId recibido:", userId);

    // Iterar sobre cada cartera y guardarla en la base de datos
    for (const portfolio of portfolioData.portfolios) {
      const newPortfolio = new Portfolio({
        userId, // Asignar el userId a cada cartera
        name: portfolio.name,
        stocks: portfolio.stocks || [],
      });

      await newPortfolio.save();
      console.log(`✅ Portafolio "${portfolio.name}" agregado correctamente.`);
      console.log(`✅ Guardado:`, JSON.stringify(newPortfolio, null, 2));
    }
  } catch (error) {
    console.error("❌ Error al insertar los portafolios:", error);
  } finally {
    mongoose.connection.close(); // 🔥 Cerramos la conexión después de insertar
  }
}

// Cambiamos el module.exports por export default
export default addPortfolios;