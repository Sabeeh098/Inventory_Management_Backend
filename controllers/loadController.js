const Category = require("../model/categoryModel");
const Load = require("../model/loadModel");
const UsedLoads = require("../model/usedPallet");

const fs = require("fs");
const path = require("path");

const deleteLoadById = async (req, res) => {
  const loadId = req.params.loadId;
  try {
    // Find the load by ID and delete it
    await Load.findByIdAndDelete(loadId);
    res.status(200).json({ message: 'Load deleted successfully' });
  } catch (error) {
    console.error('Error deleting load:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteLoads = async (req, res) => {
  const { loadIds } = req.body;

  try {
    await Load.deleteMany({ _id: { $in: loadIds } });
    res.status(200).json({ message: 'Loads deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete loads', details: error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required for category' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createLoad = async (req, res) => {
  try {
    const {
      load: {
        loadNumber,
        loadCost,
        palletsCount,
        perPalletCost,
        category,
        loadDate,
        skuCode,
        brands,
        barcodeImage,
      },
    } = req.body;

    const newLoad = new Load({
      loadNumber,
      skuNumber: skuCode,
      loadCost,
      palletsCount,
      perPalletCost,
      category,
      loadDate,
      brands,
      barcodeImage,
    });

    // Save the new Load instance to the database
    await newLoad.save();

    console.log(newLoad, "Load created");
    res.status(201).json(newLoad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getLoads = async (req, res) => {
  try {
    const { type } = req.query;
    let loads = null;
    if (type == "indicators") {
      loads = await Load.find().populate('category'); // Populate the category field
    } else if (type == "scans") {
      loads = await Load.find({
        $expr: { $ne: ["$palletsCount", "$remainingPalletsCount"] },
      }).populate('category'); // Populate the category field
    } else {
      loads = await Load.find().populate('category'); // Populate the category field
    }
    res.json(loads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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
        perPalletCost: loadDetails.perPalletCost,
        category: loadDetails.category,
        loadDate: loadDetails.loadDate,
        barcodeImage: loadDetails.barcodeImage,
        brands: loadDetails.brands,
      });
    } else {
      res.status(404).json({ message: "Load not found" });
    }
  } catch (error) {
    console.error("Error fetching load details:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBarcodeImageById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const loadDetails = await Load.findById(id);

    if (!loadDetails) {
      return res.status(404).json({ message: "Load not found" });
    }

    const barcodeImagePath = path.join(
      __dirname,
      "..",
      "barcodes",
      `${loadDetails.loadNumber}_barcode.svg`
    );

    // Check if the file exists
    if (fs.existsSync(barcodeImagePath)) {
      // Read the file and send it as a response
      const barcodeImage = fs.readFileSync(barcodeImagePath);
      res.writeHead(200, { "Content-Type": "image/svg+xml" });
      res.end(barcodeImage, "binary");
    } else {
      res.status(404).json({ message: "Barcode image not found" });
    }
  } catch (error) {
    console.error("Error fetching barcode image:", error);
    res.status(500).json({ message: "Server Error" });
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
      res
        .status(404)
        .json({ message: "Load not found for SKU code: " + skuCode });
    }
  } catch (error) {
    console.error("Error fetching load details by SKU code:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getBrandDetailsBySkuCode = async (req, res) => {
  try {
    const { skuCode } = req.params;

    // Retrieve brand details from the database based on the SKU code
    const brandDetails = await Load.findOne({ "brands.skuCode": skuCode });

    if (brandDetails) {
      res.json(brandDetails.brands[0]); // Assuming there is only one brand per SKU for simplicity
    } else {
      res
        .status(404)
        .json({ message: "Brand not found for SKU code: " + skuCode });
    }
  } catch (error) {
    console.error("Error fetching brand details by SKU code:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateRemainingPalletsCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { remainingPalletsCount } = req.body;
    await Load.findByIdAndUpdate(id, {
      remainingPalletsCount: remainingPalletsCount,
    });
    res
      .status(200)
      .json({ message: "Remaining pallets count updated successfully" });
  } catch (error) {
    console.error("Error updating remaining pallets count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUsedLoads = async (req, res) => {
  try {
    const { load, usedPalletsCount, remainingPalletsCount } = req.body;
    // Update Loads remainingPalletsCount
    await Load.findByIdAndUpdate(load, {
      remainingPalletsCount: remainingPalletsCount + usedPalletsCount,
    });

    // Add new used Pallet
    const newUsedLoad = new UsedLoads({
      load,
      palletsOut: usedPalletsCount,
    });
    await newUsedLoad.save();
    res.status(201).json(newUsedLoad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const fetchUsedLoadsInfo = async (req, res) => {
  try {

    // Extract search term from the query parameter
    const searchTerm = req.query.searchTerm || "";

    const result = await UsedLoads.aggregate([
      {
        $lookup: {
          from: "loads",
          localField: "load",
          foreignField: "_id",
          as: "loadDetails",
        },
      },
      {
        $unwind: "$loadDetails",
      },
      {
        $project: {
          loadNumber: "$loadDetails.loadNumber",
          loadCost: "$loadDetails.loadCost",
          palletsOut: 1,
          addedAt: 1,
          palletsCount: "$loadDetails.palletsCount",
          perPalletCost: "$loadDetails.perPalletCost"
        },
      },
    
      {
        $match: {
          $or: [
            { loadNumber: { $regex: searchTerm, $options: "i" } },
            // Add more fields to search as needed
          ],
        },
      },
    ]);

    // Send the result as a JSON response
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error("Error fetching used loads information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const recentLoadFetch = async(req, res) => {
  try {
   
    const recentLoads = await Load.find().sort({ loadDate: -1 }).limit(10);

    res.status(200).json(recentLoads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching recent loads." });
  }
};

const getTotalLoadsCount = async (req, res) => {
  try {
    const totalLoadsCount = await Load.countDocuments();
  
    res.status(200).json({ totalLoadsCount });
  } catch (error) {
    console.error('Error getting total loads count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getTotalLoadsCost = async (req, res) => {
  try {
    const totalLoadsCost = await Load.aggregate([
      {
        $group: {
          _id: null,
          totalLoadCost: { $sum: '$loadCost' },
        },
      },
    ]);

  
    const result = totalLoadsCost.length > 0 ? totalLoadsCost[0].totalLoadCost : 0;

    res.status(200).json({ totalLoadCost: result });
  
  } catch (error) {
    console.error('Error getting total loads cost:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getTotalPallets = async (req, res) => {
  try {
    const loads = await Load.find();

    const totalPallets = loads.reduce((acc, load) => {
      const loadPallets = load.isBrand
        ? load.brands.reduce((brandAcc, brand) => brandAcc + brand.totalPallet, 0)
        : load.palletsCount;

      return acc + loadPallets;
    }, 0);

    res.json({ totalPallets });

  } catch (error) {
    console.error("Error fetching total pallets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getRemainingPallets = async (req, res) => {
  try {

    const result = await Load.aggregate([
      {
        $group: {
          _id: null,
          totalRemainingPallets: { $sum: '$remainingPalletsCount' },
        },
      },
    ]);


    const totalRemainingPallets = result.length > 0 ? result[0].totalRemainingPallets : 0;

    return res.json({ totalRemainingPallets });
  } catch (error) {
    console.error('Error fetching remaining pallets:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getLoadsLessThanOrEqualTo5 = async (req, res) => {
  try {
    const loads = await Load.find({
      $or: [
        { palletsCount: { $lte: 5 } },
        { remainingPalletsCount: { $lte: 5 } },
      ],
    });

   
    res.json(loads);
  } catch (error) {
    console.error('Error fetching loads less than or equal to 5:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  deleteLoadById,
  deleteLoads,
  getAllCategories,
  addCategory,
  createLoad,
  getLoads,
  getLoadDetailsById,
  getBarcodeImageById,
  getLoadDetailsBySkuCode,
  getBrandDetailsBySkuCode,
  updateRemainingPalletsCount,
  updateUsedLoads,
  fetchUsedLoadsInfo,
  recentLoadFetch,
  getTotalLoadsCount,
  getTotalPallets,
  getRemainingPallets,
  getTotalLoadsCost,
  getLoadsLessThanOrEqualTo5,
};
