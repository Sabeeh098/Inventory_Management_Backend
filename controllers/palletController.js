const Pallet = require("../model/palletModel");
const mongoose = require("mongoose");
const bwipjs = require('bwip-js');

const createPallet = async (req, res) => {
    try {
      const { palletName, palletAmount, palletCode, selectedLoad } = req.body;
  
      // Validate selectedLoad
      if (!selectedLoad || !mongoose.Types.ObjectId.isValid(selectedLoad)) {
        return res.status(400).json({ message: 'Invalid selectedLoad value' });
      }
  
      // Generate a unique SKU (you can customize this logic)
      const sku = generateUniqueSku();
  
      // Create new pallet
      const newPallet = await Pallet.create({
        palletName,
        palletAmount,
        palletCode,
        selectedLoad,
        sku,
      });
  
      // Generate barcode by SKU
      const barcodeOptions = {
        bcid: 'code128',       // Barcode type
        text: sku,             // Use SKU as barcode data
        scale: 3,              // Barcode scale factor
        height: 10,            // Barcode height, in millimeters
        includetext: true,     // Show human-readable text
      };
  
      // Save barcode as SVG
      const barcodeSvgBuffer = bwipjs.toBuffer(barcodeOptions);
      const barcodeSvgBase64 = barcodeSvgBuffer.toString('base64');
      newPallet.barcodeSvg = barcodeSvgBase64;
      await newPallet.save();
  
      // Return the new pallet with barcode information
      res.status(201).json(newPallet);
    } catch (error) {
      console.error('Error creating pallet:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Function to generate a unique SKU (you can customize this logic)
  const generateUniqueSku = () => {
    // Example: Generate SKU using timestamp and a random number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}-${random}`;
  };

  const showPallets = async (req, res) => {
    try {
      // Fetch all pallets from the database
      const pallets = await Pallet.find();
  
      // Return the list of pallets to the frontend
      res.status(200).json(pallets);
    } catch (error) {
      console.error('Error fetching pallets:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const printBarcode = async (req, res) => {
    try {
      const { palletId } = req.params;
  
      // Validate palletId
      if (!mongoose.Types.ObjectId.isValid(palletId)) {
        return res.status(400).json({ message: 'Invalid palletId value' });
      }
  
      // Find pallet by ID
      const pallet = await Pallet.findById(palletId);
  
      if (!pallet) {
        return res.status(404).json({ message: 'Pallet not found' });
      }
  
      // Retrieve the stored barcode from the pallet
      const barcodeSvgBase64 = pallet.barcodeSvg;
  
      if (!barcodeSvgBase64) {
        return res.status(404).json({ message: 'Barcode not found for the pallet' });
      }
  
      // Send the barcode SVG to the client
      res.status(200).json({ barcodeSvg: barcodeSvgBase64 });
    } catch (error) {
      console.error('Error printing barcode:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports = {
  createPallet,
  printBarcode,
  showPallets,
};
