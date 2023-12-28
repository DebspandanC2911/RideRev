const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    Balance: {
        type: Number,
        required: true,
        default: 10000,
    },
    friendInvited: {
        type: Number,
        default: 0,
    },
    Watchlist:[{
        coinId :{
            type:String
        }
    }],
    coinholdings:[{
        coinID:{
            type:String,
        },
        amount:{
            type:Number
        },
        
    }],
    priceholdings:[{
        coinId:{
            type:String,
        },
        amount:
        {
            type:Number,
        },
        buyprice:
        {
            type:Number
        }
    }]
});

module.exports = mongoose.model('portfolio', PortfolioSchema);
