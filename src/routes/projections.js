const express = require("express");
const router = express.Router();
const db = require("../db");
const { project } = require("../projections/projector");

router.post("/rebuild", async (req, res) => {
  await db.query("DELETE FROM account_summaries");
  await db.query("DELETE FROM transaction_history");

  const events = await db.query(
    "SELECT * FROM events ORDER BY event_number"
  );

  for (let e of events.rows) {
    await project(e);
  }

  res.status(202).json({ message: "Rebuilt" });
});


router.get("/status", async (req, res) => {
  const totalEvents = await db.query(
    "SELECT COUNT(*) FROM events"
  );

  const totalAccounts = await db.query(
    "SELECT COUNT(*) FROM account_summaries"
  );

  res.json({
    totalEventsInStore: parseInt(totalEvents.rows[0].count),
    projections: [
      {
        name: "AccountSummaries",
        totalAccounts: parseInt(totalAccounts.rows[0].count),
        lag: 0
      }
    ]
  });
});

module.exports = router;