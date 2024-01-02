const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type :{
        type : String ,
    } ,
    Timestamp :
    {
        type:Date,
    },
    coinId :
    {
        type : String 
    } ,
    status :
    {
        type:Boolean
    },
    Amount :
    {
        type:Number
    }

});

module.exports = mongoose.model('Transaction', TransactionSchema);
