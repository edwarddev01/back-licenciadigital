const { request, response } = require("express");
const { Sale } = require("../models/sale.model");
const { Purchase } = require("../models/purchase.model");
const { SaleDetails } = require("../models/sale_details.model");
const { Client } = require("../models/client.model");
const { Product } = require("../models/product.model");
const { Sequelize, Op, fn, col, literal } = require("sequelize");

class DashboardController {
  static async getCurrentMonthData(req = request, res = response) {
    try {
      const now = new Date();
      const startOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
      );
      const endOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
      );

      // Generar todos los días del mes actual
      const daysInMonth = [];
      for (let i = 1; i <= endOfMonth.getUTCDate(); i++) {
        daysInMonth.push({
          date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), i)),
          total_sales: 0,
        });
      }
      const daysInMonth2 = [];
      for (let i = 1; i <= endOfMonth.getUTCDate(); i++) {
        daysInMonth2.push({
          date: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), i)),
          total_purchases: 0,
        });
      }

      // Ventas diarias en el mes actual
      const dailySalesData = await Sale.findAll({
        attributes: [
          [fn("DATE", col("date")), "date"],
          [fn("SUM", col("total_price")), "total_sales"],
        ],
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: [fn("DATE", col("date"))],
        order: [[fn("DATE", col("date")), "ASC"]],
      });

      // Compras diarias en el mes actual
      const dailyPurchasesData = await Purchase.findAll({
        attributes: [
          [fn("DATE", col("date")), "date"],
          [fn("SUM", col("total_cost")), "total_purchases"],
        ],
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: [fn("DATE", col("date"))],
        order: [[fn("DATE", col("date")), "ASC"]],
      });

      // Mapear los datos de ventas diarias al array de días del mes
      const dailySales = daysInMonth.map((day) => {
        const sale = dailySalesData.find((saleData) => {
          const saleDate = new Date(saleData.dataValues.date);
          return (
            saleDate.getUTCFullYear() === day.date.getUTCFullYear() &&
            saleDate.getUTCMonth() === day.date.getUTCMonth() &&
            saleDate.getUTCDate() === day.date.getUTCDate()
          );
        });
        if (sale) {
          day.total_sales = sale.dataValues.total_sales;
        }
        return day;
      });

      // Mapear los datos de compras diarias al array de días del mes
      const dailyPurchases = daysInMonth2.map((day) => {
        const purchase = dailyPurchasesData.find((purchaseData) => {
          const purchaseDate = new Date(purchaseData.dataValues.date);
          return (
            purchaseDate.getUTCFullYear() === day.date.getUTCFullYear() &&
            purchaseDate.getUTCMonth() === day.date.getUTCMonth() &&
            purchaseDate.getUTCDate() === day.date.getUTCDate()
          );
        });
        if (purchase) {
          day.total_purchases = purchase.dataValues.total_purchases;
        }
        return day;
      });

      // Continuar con el resto de las operaciones
      const totalSales = await Sale.sum("total_price", {
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalPurchases = await Purchase.sum("total_cost", {
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalUnpaidSales = await Sale.sum("unpaid", {
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalPendingPurchases = await Purchase.sum("total_cost", {
        where: {
          payment_status: "pendiente",
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalProductsSold = await SaleDetails.sum("quantity", {
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalClientsWhoBought = await Sale.count({
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        distinct: true,
        col: "id_client",
      });

      const bestSellingProducts = await SaleDetails.findAll({
        attributes: [
          "id_product",
          [fn("SUM", col("quantity")), "total_sold"],
          [fn("SUM", literal("quantity * price")), "total_revenue"],
        ],
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: ["id_product"],
        order: [[literal("total_sold"), "DESC"]],
        limit: 3,
        include: {
          model: Product,
          attributes: ["name", "normal_price", "resseller_price"],
        },
      });

      bestSellingProducts.forEach((product) => {
        product.dataValues.percentage_of_total_sales =
          (product.dataValues.total_revenue / totalSales) * 100;
      });

      const bestClients = await Sale.findAll({
        attributes: [
          "id_client",
          [fn("SUM", col("total_price")), "total_spent"],
        ],
        where: {
          date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        group: ["id_client"],
        order: [[literal("total_spent"), "DESC"]],
        limit: 3,
        include: {
          model: Client,
          attributes: ["name", "phone", "email"],
        },
      });

      bestClients.forEach((client) => {
        client.dataValues.percentage_of_total_sales =
          (client.dataValues.total_spent / totalSales) * 100;
      });

      res.send({
        status: "ok",
        data: {
          dailySales,
          dailyPurchases,
          totalUnpaidSales,
          totalPendingPurchases,
          totalProductsSold,
          totalClientsWhoBought,
          bestSellingProducts,
          bestClients,
          totalSales,
          totalPurchases,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error al obtener los datos del mes actual.",
      });
    }
  }

  static async getLastThreeMonthsData(req = request, res = response) {
    try {
      const now = new Date();
      const startOfPeriod = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)
      ); // Hace 3 meses en UTC
      const endOfPeriod = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
      ); // Último día del mes actual en UTC

      const monthsInPeriod = [];
      for (let i = 2; i >= 0; i--) {
        const startOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
        );
        monthsInPeriod.push({
          month: startOfMonth.getUTCMonth() + 1,
          year: startOfMonth.getUTCFullYear(),
          total_sales: 0,
        });
      }

      const monthsInPeriod2 = [];
      for (let i = 2; i >= 0; i--) {
        const startOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
        );
        monthsInPeriod2.push({
          month: startOfMonth.getUTCMonth() + 1,
          year: startOfMonth.getUTCFullYear(),
          total_purchases: 0,
        });
      }

      // Ventas mensuales en los últimos 3 meses
      const monthlySalesData = await Sale.findAll({
        attributes: [
          [fn("MONTH", col("date")), "month"],
          [fn("YEAR", col("date")), "year"],
          [fn("SUM", col("total_price")), "total_sales"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: [fn("YEAR", col("date")), fn("MONTH", col("date"))],
        order: [
          [fn("YEAR", col("date")), "ASC"],
          [fn("MONTH", col("date")), "ASC"],
        ],
      });

      // Compras mensuales en los últimos 3 meses
      const monthlyPurchasesData = await Purchase.findAll({
        attributes: [
          [fn("MONTH", col("date")), "month"],
          [fn("YEAR", col("date")), "year"],
          [fn("SUM", col("total_cost")), "total_purchases"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: [fn("YEAR", col("date")), fn("MONTH", col("date"))],
        order: [
          [fn("YEAR", col("date")), "ASC"],
          [fn("MONTH", col("date")), "ASC"],
        ],
      });

      // Mapear los datos de ventas y compras mensuales al array de meses en el período
      const monthlySales = monthsInPeriod.map((month) => {
        const sale = monthlySalesData.find((saleData) => {
          return (
            saleData.dataValues.year === month.year &&
            saleData.dataValues.month === month.month
          );
        });
        if (sale) {
          month.total_sales = sale.dataValues.total_sales;
        }
        return month;
      });

      const monthlyPurchases = monthsInPeriod2.map((month) => {
        const purchase = monthlyPurchasesData.find((purchaseData) => {
          return (
            purchaseData.dataValues.year === month.year &&
            purchaseData.dataValues.month === month.month
          );
        });
        if (purchase) {
          month.total_purchases = purchase.dataValues.total_purchases;
        }
        return month;
      });

      // Suma del total_price de todas las ventas del período
      const totalSales = await Sale.sum("total_price", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del total_cost de todas las compras del período
      const totalPurchases = await Purchase.sum("total_cost", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del unpaid de las ventas del período
      const totalUnpaidSales = await Sale.sum("unpaid", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del total_cost de las compras cuyo estado de pago es pendiente
      const totalPendingPurchases = await Purchase.sum("total_cost", {
        where: {
          payment_status: "pendiente",
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Total de productos vendidos en el período
      const totalProductsSold = await SaleDetails.sum("quantity", {
        where: {
          "$sale.date$": {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        include: {
          model: Sale,
          attributes: [],
        },
      });

      // Total de clientes que han comprado en el período
      const totalClientsWhoBought = await Sale.count({
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        distinct: true,
        col: "id_client",
      });

      // Los 3 productos más vendidos con total recaudado y porcentaje con respecto al total de ventas
      const bestSellingProducts = await SaleDetails.findAll({
        attributes: [
          "id_product",
          [fn("SUM", literal("quantity * price")), "total_revenue"],
        ],
        where: {
          "$sale.date$": {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        include: [
          {
            model: Product,
            attributes: ["name", "normal_price", "resseller_price"],
          },
          {
            model: Sale,
            attributes: [], // No necesitamos campos adicionales de la venta
          },
        ],
        group: ["id_product"],
        order: [[literal("total_revenue"), "DESC"]],
        limit: 3,
      });

      // Añadir el porcentaje con respecto al total de ventas a los productos más vendidos
      bestSellingProducts.forEach((product) => {
        product.dataValues.percentage_of_total_sales =
          (product.dataValues.total_revenue / totalSales) * 100;
      });

      // Los 3 mejores clientes con el total comprado y porcentaje con respecto al total de ventas
      const bestClients = await Sale.findAll({
        attributes: [
          "id_client",
          [fn("SUM", col("total_price")), "total_spent"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: ["id_client"],
        order: [[literal("total_spent"), "DESC"]],
        limit: 3,
        include: {
          model: Client,
          attributes: ["name", "phone", "email"],
        },
      });

      bestClients.forEach((client) => {
        client.dataValues.percentage_of_total_sales =
          (client.dataValues.total_spent / totalSales) * 100;
      });

      res.send({
        status: "ok",
        data: {
          monthlySales,
          monthlyPurchases,
          totalUnpaidSales,
          totalPendingPurchases,
          totalProductsSold,
          totalClientsWhoBought,
          bestSellingProducts,
          bestClients,
          totalSales,
          totalPurchases,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error al obtener los datos de los últimos 3 meses.",
      });
    }
  }

  static async getLastSixMonthsData(req = request, res = response) {
    try {
      const now = new Date();
      const startOfPeriod = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)
      ); // Hace 6 meses en UTC
      const endOfPeriod = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)
      ); // Último día del mes actual en UTC

      const monthsInPeriod = [];
      for (let i = 5; i >= 0; i--) {
        const startOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
        );
        monthsInPeriod.push({
          month: startOfMonth.getUTCMonth() + 1,
          year: startOfMonth.getUTCFullYear(),
          total_sales: 0,
        });
      }

      const monthsInPeriod2 = [];
      for (let i = 5; i >= 0; i--) {
        const startOfMonth = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)
        );
        monthsInPeriod2.push({
          month: startOfMonth.getUTCMonth() + 1,
          year: startOfMonth.getUTCFullYear(),
          total_purchases: 0,
        });
      }

      // Ventas mensuales en los últimos 6 meses
      const monthlySalesData = await Sale.findAll({
        attributes: [
          [fn("MONTH", col("date")), "month"],
          [fn("YEAR", col("date")), "year"],
          [fn("SUM", col("total_price")), "total_sales"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: [fn("YEAR", col("date")), fn("MONTH", col("date"))],
        order: [
          [fn("YEAR", col("date")), "ASC"],
          [fn("MONTH", col("date")), "ASC"],
        ],
      });

      // Compras mensuales en los últimos 6 meses
      const monthlyPurchasesData = await Purchase.findAll({
        attributes: [
          [fn("MONTH", col("date")), "month"],
          [fn("YEAR", col("date")), "year"],
          [fn("SUM", col("total_cost")), "total_purchases"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: [fn("YEAR", col("date")), fn("MONTH", col("date"))],
        order: [
          [fn("YEAR", col("date")), "ASC"],
          [fn("MONTH", col("date")), "ASC"],
        ],
      });

      // Mapear los datos de ventas y compras mensuales al array de meses en el período
      const monthlySales = monthsInPeriod.map((month) => {
        const sale = monthlySalesData.find((saleData) => {
          return (
            saleData.dataValues.year === month.year &&
            saleData.dataValues.month === month.month
          );
        });
        if (sale) {
          month.total_sales = sale.dataValues.total_sales;
        }
        return month;
      });

      const monthlyPurchases = monthsInPeriod2.map((month) => {
        const purchase = monthlyPurchasesData.find((purchaseData) => {
          return (
            purchaseData.dataValues.year === month.year &&
            purchaseData.dataValues.month === month.month
          );
        });
        if (purchase) {
          month.total_purchases = purchase.dataValues.total_purchases;
        }
        return month;
      });
      // Suma del total_price de todas las ventas del mes
      const totalSales = await Sale.sum("total_price", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del total_cost de todas las compras del mes
      const totalPurchases = await Purchase.sum("total_cost", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del unpaid de las ventas del mes
      const totalUnpaidSales = await Sale.sum("unpaid", {
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Suma del total_cost de las compras cuyo estado de pago es pendiente
      const totalPendingPurchases = await Purchase.sum("total_cost", {
        where: {
          payment_status: "pendiente",
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
      });

      // Total de productos vendidos en el mes
      const totalProductsSold = await SaleDetails.sum("quantity", {
        where: {
          "$sale.date$": {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        include: {
          model: Sale,
          attributes: [],
        },
      });

      // Total de clientes que han comprado en el mes
      const totalClientsWhoBought = await Sale.count({
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        distinct: true,
        col: "id_client",
      });

      // Los 3 productos más vendidos con total recaudado y porcentaje con respecto al total de ventas
      const bestSellingProducts = await SaleDetails.findAll({
        attributes: [
          "id_product",
          [fn("SUM", literal("quantity * price")), "total_revenue"],
        ],
        where: {
          "$sale.date$": {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        include: [
          {
            model: Product,
            attributes: ["name", "normal_price", "resseller_price"],
          },
          {
            model: Sale,
            attributes: [], // No necesitamos campos adicionales de la venta
          },
        ],
        group: ["id_product"],
        order: [[literal("total_revenue"), "DESC"]],
        limit: 3,
      });

      // Añadir el porcentaje con respecto al total de ventas a los productos más vendidos
      bestSellingProducts.forEach((product) => {
        product.dataValues.percentage_of_total_sales =
          (product.dataValues.total_revenue / totalSales) * 100;
      });

      // Los 3 mejores clientes con el total comprado y porcentaje con respecto al total de ventas
      const bestClients = await Sale.findAll({
        attributes: [
          "id_client",
          [fn("SUM", col("total_price")), "total_spent"],
        ],
        where: {
          date: {
            [Op.between]: [startOfPeriod, endOfPeriod],
          },
        },
        group: ["id_client"],
        order: [[literal("total_spent"), "DESC"]],
        limit: 3,
        include: {
          model: Client,
          attributes: ["name", "phone", "email"],
        },
      });

      bestClients.forEach((client) => {
        client.dataValues.percentage_of_total_sales =
          (client.dataValues.total_spent / totalSales) * 100;
      });

      res.send({
        status: "ok",
        data: {
          monthlySales,
          monthlyPurchases,
          totalUnpaidSales,
          totalPendingPurchases,
          totalProductsSold,
          totalClientsWhoBought,
          bestSellingProducts,
          bestClients,
          totalSales,
          totalPurchases,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        status: "error",
        message: "Error al obtener los datos de los últimos 6 meses.",
      });
    }
  }
}

module.exports = { DashboardController };
