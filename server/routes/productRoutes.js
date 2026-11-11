
import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import Product from "../models/Product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ======================================
// HELPER: DELETE PRODUCT IMAGE
// ======================================

const deleteImage = (image) => {
  if (!image) return;

  const filename = path.basename(image);

  const filePath = path.resolve(
    "uploads",
    "products",
    filename
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ======================================
// GET ALL PRODUCTS
// ======================================

router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 100,
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const currentPage = Math.max(1, Number(page));
    const perPage = Math.min(100, Math.max(1, Number(limit)));

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / perPage),
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================
// GET SINGLE PRODUCT
// ======================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================
// ADD NEW PRODUCT WITH IMAGE
// ======================================

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      rating,
      sold,
      category,
      stock,
    } = req.body;

    if (
      !name?.trim() ||
      price === undefined ||
      price === "" ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description || "",
      price: Number(price),
      oldPrice: Number(oldPrice || 0),
      discount: Number(discount || 0),
      rating: Number(rating || 0),
      sold: Number(sold || 0),
      category: category.trim(),
      stock: Number(stock || 0),
      image: req.file
        ? `/uploads/products/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product,
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================
// UPDATE PRODUCT
// ======================================

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const fields = [
      "name",
      "description",
      "price",
      "oldPrice",
      "discount",
      "rating",
      "sold",
      "category",
      "stock",
    ];

    const numberFields = [
      "price",
      "oldPrice",
      "discount",
      "rating",
      "sold",
      "stock",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = numberFields.includes(field)
          ? Number(req.body[field])
          : req.body[field];
      }
    });

    if (req.file) {
      const oldImage = product.image;

      product.image = `/uploads/products/${req.file.filename}`;

      await product.save();

      deleteImage(oldImage);
    } else {
      await product.save();
    }

    res.json({
      success: true,
      message: "Product updated successfully!",
      product,
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================
// DELETE PRODUCT
// ======================================

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    deleteImage(product.image);

    res.json({
      success: true,
      message: "Product deleted successfully!",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
