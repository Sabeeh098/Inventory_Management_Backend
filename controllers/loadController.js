const Load = require('../model/loadModel');

const fs = require('fs');
const path = require('path');

const createLoad = async (req, res) => {
  try {
    const {
      load: {
        loadNumber,
        loadCost,
        palletsCount,
        perPalletPrice,
        category,
        loadDate,
        skuCode,
        barcodeImage,
        brands,
      },
    } = req.body;
    console.log(req.body,"'bodddddyyyy-----")
    const newLoad = new Load({
      loadNumber,
      skuNumber: skuCode,
      loadCost,
      palletsCount,
      perPalletPrice,
      category,
      loadDate,
      brands,
      barcodeImage,
    });

    // Save the new Load instance to the database
    await newLoad.save();

    console.log(newLoad, 'Load created');
    res.status(201).json(newLoad);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};




const getLoads = async (req, res) => {
  try {
    const loads = await Load.find();
    res.json(loads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getLoadDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve load details from the database based on the load ID
    const loadDetails = await Load.findById(id);

    if (loadDetails) {
      res.json({
        loadNumber: loadDetails.loadNumber,
        skuNumber: loadDetails.skuNumber,
        loadCost: loadDetails.loadCost,
        palletsCount: loadDetails.palletsCount,
        perPalletPrice: loadDetails.perPalletPrice,
        category: loadDetails.category,
        loadDate: loadDetails.loadDate,
        barcodeImage: loadDetails.barcodeImage,
        brands: loadDetails.brands,
      });
    } else {
      res.status(404).json({ message: 'Load not found' });
    }
  } catch (error) {
    console.error('Error fetching load details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getBarcodeImageById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const loadDetails = await Load.findById(id);

    if (!loadDetails) {
      return res.status(404).json({ message: 'Load not found' });
    }

    const barcodeImagePath = path.join(__dirname, '..', 'barcodes', `${loadDetails.loadNumber}_barcode.svg`);

    // Check if the file exists
    if (fs.existsSync(barcodeImagePath)) {
      // Read the file and send it as a response
      const barcodeImage = fs.readFileSync(barcodeImagePath);
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      res.end(barcodeImage, 'binary');
    } else {
      res.status(404).json({ message: 'Barcode image not found' });
    }
  } catch (error) {
    console.error('Error fetching barcode image:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getLoadDetailsBySkuCode = async (req, res) => {
  try {
    const { skuCode } = req.params;

    // Retrieve load details from the database based on the SKU code
    const loadDetails = await Load.findOne({ skuNumber: skuCode });

    if (loadDetails) {
      res.json(loadDetails);
    } else {
      res.status(404).json({ message: 'Load not found for SKU code: ' + skuCode });
    }
  } catch (error) {
    console.error('Error fetching load details by SKU code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createLoad,
  getLoads,
  getLoadDetailsById,
  getBarcodeImageById,
  getLoadDetailsBySkuCode,
};