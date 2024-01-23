const mongoose = require("mongoose");

const loadSchema = new mongoose.Schema({
  loadNumber: {
    type: String,
  },
  skuNumber: {
    type: String,
  },
  loadCost: {
    type: Number,
  },
  palletsCount: {
    type: Number,
  },
  perPalletPrice: {
    type: Number,
  },
  category: {
    type: String,
  },
  loadDate: {
    type: Date,
  },
  barcodeImage: {
    type: String, // Assuming you are storing the image data as a base64 string
  },
  isBrands: {
    type: Boolean,
    default: false,
  },
  brands: [
    {
      brandName: {
        type: String,
      },
      brandTotalPrice: {
        type: Number,
      },
      brandPalletsCount: {
        type: Number,
      },
      skuCode: {
        type: String,
      },
      barcodeImage: {
        type: String, // Assuming you are storing the image data as a base64 string
      },
    },
  ],
});

const Load = mongoose.model("Load", loadSchema);

module.exports = Load;
