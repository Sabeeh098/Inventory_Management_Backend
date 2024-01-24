const mongoose = require("mongoose");

const usedPalletsSchema = new mongoose.Schema({

    load : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Load",
    },

    palletsOut : {
        type: Number,
        
    },
    
    updatedAt : {
        type: Date,
        default: Date.now()
    }
});

const UsedLoads = mongoose.model("UsedLoads",usedPalletsSchema);

module.exports = UsedLoads;
