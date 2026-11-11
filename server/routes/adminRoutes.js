import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

// Admin dashboard statistics
router.get("/dashboard", async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenueResult,
      customers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({ status: "Pending" }),

      Order.countDocuments({ status: "Delivered" }),

      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),

      Order.distinct("customer.phone"),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Product.find({ stock: { $lte: 5 } })
        .sort({ stock: 1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        totalCustomers: customers.length,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Dashboard data fetch nahi ho saka.",
    });
  }
});

export default router;