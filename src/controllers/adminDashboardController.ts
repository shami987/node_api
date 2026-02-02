import { Request, Response } from "express";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Product } from "../models/Product";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total revenue from all orders
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total customers count
    const totalCustomers = await User.countDocuments({ role: { $ne: "admin" } });

    // Calculate growth rate (mock calculation - you can implement actual logic)
    const growthRate = 23.5;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      growthRate,
      revenueChange: "+20.1%",
      ordersChange: "+12.5%",
      customersChange: "+8.2%",
      growthChange: "+4.3%"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error });
  }
};

export const getRevenueData = async (req: Request, res: Response) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
              ],
              default: "Unknown"
            }
          },
          revenue: 1,
          orders: 1
        }
      }
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch revenue data", error });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          sales: 1,
          revenue: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top products", error });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(10);

    const transformedOrders = recentOrders.map(order => ({
      _id: order._id,
      id: order._id,
      user: {
        email: (order.userId as any)?.email,
        name: (order.userId as any)?.name
      },
      items: order.items,
      total: order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: order.status,
      createdAt: (order as any).createdAt
    }));

    res.json(transformedOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent orders", error });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Get basic analytics data
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalCustomers = await User.countDocuments({ role: { $ne: "admin" } });
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      ordersByStatus,
      conversionRate: 12.5,
      averageOrderValue: totalRevenue[0]?.total ? (totalRevenue[0].total / totalOrders) : 0
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};