const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
const Validator = require("../validation/validation");

//-----------------------------------------Post Api(create cart with userId)-------------------------------//

const createCart = async function (req, res) {
    try {
        const userId = req.params.userId;
        const body = req.body;

        //-----------Request Body Validation---------//

        if (body.length == 0) {
            return res.status(400).send({ status: false, message: "Please provide valid request body" });
        }

        if (!Validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "enter valid userId" });
        }
        const findUserId = await userModel.findById({ _id: userId });

        if (!findUserId) {
            return res.status(400).send({ status: false, message: `User doesn't exist by ${userId}`});
        }

        let totalPrice = 0
        let totalItems = 0

        for (let i = 0; i < body.length; i++) {

            if (!body[i].productId) {
                return res.status(400).send({ status: false, message: ` productId is required` });
            }
            if (!Validator.isValidObjectId(body[i].productId)) {
                return res.status(400).send({ status: false, message: `invalid productId ` });
            }
            const findProductId = await productModel.findOne({ _id: body[i].productId, isDeleted: false });
            if (!findProductId) {
                return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` });
            }

            if (!Object.keys(body[i]).includes("quantity")) {
                return res.status(400).send({ status: false, message: ` quantity is required` });
            }
            if (typeof body[i].quantity != "number") {
                return res.status(400).send({ status: false, message: ` quantity should be a number` });
            }
            if (body[i].quantity < 1) {
                return res.status(400).send({ status: false, message: `quantity must be minimum 1` });
            }
            totalPrice += (findProductId.price * body[i].quantity)
            totalItems += (1 * body[i].quantity)
        }

        var findcart = await cartModel.findOne({ userId: userId, isDeleted: false })
        if (!findcart) {
            let cart = {}
            cart.userId = userId
            cart.items = body
            cart.totalPrice = totalPrice
            cart.totalItems = totalItems
            let createdCart = await cartModel.create(cart)
            //console.log(createdCart.items)
            return res.status(201).send({ status: true, message: "cart created successfully", data: createdCart })
        }
        let obj = {
            $push: { "items": body },
            totalPrice: findcart.totalPrice + totalPrice,
            totalItems: findcart.totalItems + totalItems
    
        }
        let createdCart = await cartModel.findOneAndUpdate({ userId: userId }, obj ,{new: true})
        res.status(200).send({ status: true, message: "cart updated successfully", data: createdCart })

    } catch (err) {
        res.status(500).send({ err: err.message });
    }
};


//----------------------------------------Put Api(update cart by userId)------------------------------//    

const updateCart = async function (req, res) {
    try {


    } catch (err) {
        res.status(500).send({ err: err.message });
    }
};


//----------------------------------------Get Api(getcart by userId)------------------------------//    

const getCart = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!Validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "enter valid userId" });
        }
    
        let checkUserId = await userModel.findOne({ _id: userId })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: `User doesn't exist by ${userId}` })
        }

        let data = await cartModel.findOne({ userId })
        if (!data) {
            return res.status(404).send({ status: false, message: `Cart does not Exist with user id :${userId}` })
        }
    
        res.status(200).send({ status: true, data: data })

    } catch (err) {
        res.status(500).send({ err: err.message });
    }
};


//----------------------------------------Delete Api(Delete cart by userId)------------------------------//    

const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId;

        let Cart = await cartModel.findOne({ userId: userId });
        if (!Cart) 
            return res.status(404).send({ status: false, message: `No cart with this userId` });

        if (Cart.items.length == 0) 
           return res.status(400).send({ status: false, message: "Cart already empty" });

        let deletedData = await cartModel.findByIdAndUpdate(
            {_id: Cart._id},{items: [], totalPrice:0, totalItems:0},{ new: true })

        res.status(204).send({ status: true, message: "Cart successfully removed", data:deletedData})

    } catch (err) {
        res.status(500).send({ err: err.message });
    }
};





module.exports = { createCart, updateCart , getCart , deleteCart}   