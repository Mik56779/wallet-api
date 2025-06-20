import { sql } from "../config/db.js";

export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions[0]);
  } catch (error) {
    console.log("Error fetching transactions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
// This function handles the creation of a new transaction for a user.
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || !amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction =
      await sql`INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    console.log("Transaction created", transaction[0]);
    res.status(201).json(transaction[0]);
  } catch (err) {
    console.log("Error creating transaction", err);
    res.status(500).json({ message: "Internal Error" });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const deletedTransaction =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (deletedTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted Successfully" });
    console.log("Action done Deleted", deletedTransaction[0]);
  } catch (error) {
    console.log("Error handling request", error);
    res
      .status(500)
      .json({ message: "Internal Server Error You broke it Dude" });
  }
}

export async function getSummary(req, res) {
  try {
    const { id } = req.params;
    const summary =
      await sql`SELECT COALESCE(SUM(amount),0) AS total_amount FROM transactions WHERE user_id = ${id}`;
    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${id} AND amount > 0`;
    const expensesResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${id} AND amount < 0`;
    res.status(200).json({
      total_amount: summary[0].total_amount,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (err) {
    console.log("Error fetching summary", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
