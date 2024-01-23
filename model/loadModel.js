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
  isBrand : {
    type: Boolean,
    default: false,
  },
  brands:[
   {
    brand:{
      type: String,
    },
    totalPrice : {
      type:Number,
    },
    pallets: {
      type:Number,
    },
    skuCode : {
      type: String,
    },
    barcodeImage : {
      type: String,
    }
  },

] 
});

const Load = mongoose.model("Load", loadSchema);

module.exports = Load;
