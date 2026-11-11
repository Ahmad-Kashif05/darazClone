
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { name, phone, address, city, items } = req.body;

    // Validate customer details
    if (
      !name?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All delivery details are required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const normalizedItems = [];
    let totalAmount = 0;

    // Validate all products and quantities first
    for (const item of items) {
      const productId =
        item.productId || item._id || item.id;

      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID or quantity.",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your cart was not found.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} items in stock.`,
        });
      }

      normalizedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      totalAmount += product.price * quantity;
    }

    // Atomically reserve stock to avoid selling unavailable quantities
    const reservedProducts = [];

    for (const item of normalizedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        // Restore stock reserved earlier in this request
        for (const reserved of reservedProducts) {
          await Product.updateOne(
            { _id: reserved.product },
            { $inc: { stock: reserved.quantity } }
          );
        }

        return res.status(409).json({
          success: false,
          message: `${item.name} is no longer available in the requested quantity. Please refresh and try again.`,
        });
      }

      reservedProducts.push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    try {
      const order = await Order.create({
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
        },
        items: normalizedItems,
        totalAmount,
        paymentMethod: "Cash on Delivery",
      });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order,
      });
    } catch (error) {
      // Restore stock if order creation fails
      for (const reserved of reservedProducts) {
        await Product.updateOne(
          { _id: reserved.product },
          { $inc: { stock: reserved.quantity } }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place order. Please try again.",
    });
  }
});

export default router;
