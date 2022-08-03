const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
    {
        userId: 
         {
            type : ObjectId,
             refs : "user",
             required : true
            },

         items: [{
                 productId: 
               {
                   type : ObjectId,
                  refs : "product",
                  required : true 
                },

                 quantity: 
              {
                 type : Number, 
                 required : true
                 },

             }],

         totalPrice: 
                {
                 type : Number,
                 required : true
                 },

        totalItems: 
            {
                type : Number,
                required : true
            },

        totalQuantity: 
            {
                type : Number,
                required : true
            },

         cancellable: 
            {
                type : boolean, 
                default: true
            },

         status: 
            {
                type : String, 
                default: "pending", 
                enum : ["pending", "completed", "cancled"]
            },

         deletedAt: 
            {
                type : Date
            },

         isDeleted: 
            {
                type : boolean,
                 default: false
            },
    }
)

module.exports = mongoose.model("Order", orderSchema);