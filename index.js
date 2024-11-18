const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Cargar el catálogo desde el archivo JSON
let catalog;
try {
  catalog = JSON.parse(fs.readFileSync("catalog.json", "utf8"));
} catch (error) {
  console.error("Error al cargar el catálogo:", error);
  catalog = { products: [] };
}

// Webhook para Dialogflow
app.post("/webhook", (req, res) => {
  const query = req.body.queryResult.parameters.product; // Producto consultado
  const product = catalog.products.find(
    (p) => p.name.toLowerCase() === query.toLowerCase()
  );

  if (product) {
    res.json({
      fulfillmentText: `La ${product.name} cuesta ${product.price} euros. ${product.description}`,
    });
  } else {
    res.json({
      fulfillmentText: "Lo siento, no encontré ese producto en nuestra tienda.",
    });
  }
});

// Servidor escuchando en el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
