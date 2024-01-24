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
  remainingPalletsCount: { 
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
    type: String, 
  },
  isBrand : {
    type: Boolean,
    default: false,
  },
  brands:[
   {
    brandName:{
      type: String,
    },
    brandTotalPrice : {
      type:Number,
    },
    brandPalletsCount: {
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
