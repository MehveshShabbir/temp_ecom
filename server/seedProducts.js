
const mongoose = require("mongoose");
const all_product = require("./Assets/all_product.js"); // Adjust the path if necessary
const { mongoURI } = require("./config.js");

// Define your Product schema and model
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", productSchema);

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");

  // Insert products into the collection
  Product.insertMany(all_product)
    .then((docs) => {
      console.log("Products inserted successfully");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error inserting products:", err);
      mongoose.connection.close();
    });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
