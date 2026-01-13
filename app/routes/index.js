const express = require("express");
const router = express.Router();
const db = require("../config/database");

// --- 1. HALAMAN UTAMA (LIST MENFESS) ---
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menfess ORDER BY created_at DESC"
    );
    res.render("index", { messages: rows });
  } catch (err) {
    console.error(err);
    res.render("index", { messages: [], error: "Database connection failed!" });
  }
});

// --- 2. HALAMAN TAMBAH MENFESS ---
router.get("/create", (req, res) => {
  res.render("create");
});

// --- 3. HANDLE FORM SUBMISSION ---
router.post("/send", async (req, res) => {
  const { sender, content, color } = req.body;
  if (!sender || !content) return res.redirect("/create");

  try {
    await db.query(
      "INSERT INTO menfess (sender, content, color) VALUES (?, ?, ?)",
      [sender, content, color]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/create");
  }
});

// --- 4. ROUTE LIKE ---
router.post("/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Menambah nilai kolom likes sebanyak 1 berdasarkan ID
    await db.query(
      "UPDATE menfess SET likes = likes + 1 WHERE id = ?",
      [id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error pada Route Like:", err);
    res.redirect("/");
  }
});

// --- 5. ROUTE DISLIKE ---
router.post("/dislike/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Menambah nilai kolom dislikes sebanyak 1 berdasarkan ID
    await db.query(
      "UPDATE menfess SET dislikes = dislikes + 1 WHERE id = ?",
      [id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error pada Route Dislike:", err);
    res.redirect("/");
  }
});

module.exports = router;