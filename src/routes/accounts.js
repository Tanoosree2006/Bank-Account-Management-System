const express = require("express");
const router = express.Router();

const db = require("../db");
const { buildState } = require("../utils/stateBuilder");

const {
  createAccount,
  deposit,
  withdraw,
  closeAccount,
} = require("../commands/accountCommands");

const {
  getAccount,
  getTransactions,
} = require("../queries/accountQueries");

const { getEvents } = require("../events/eventStore");

// =====================
// CREATE ACCOUNT
// =====================
router.post("/", async (req, res) => {
  try {
    await createAccount(req.body);
    res.status(202).send();
  } catch (e) {
    res.status(409).send(e.message);
  }
});

// =====================
// DEPOSIT
// =====================
router.post("/:id/deposit", async (req, res) => {
  try {
    await deposit(req.params.id, req.body);
    res.status(202).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// =====================
// WITHDRAW
// =====================
router.post("/:id/withdraw", async (req, res) => {
  try {
    await withdraw(req.params.id, req.body);
    res.status(202).send();
  } catch (e) {
    res.status(409).send(e.message);
  }
});

// =====================
// CLOSE ACCOUNT
// =====================
router.post("/:id/close", async (req, res) => {
  try {
    await closeAccount(req.params.id);
    res.status(202).send();
  } catch (e) {
    res.status(409).send(e.message);
  }
});

// =====================
// GET ACCOUNT (READ MODEL)
// =====================
router.get("/:id", async (req, res) => {
  const data = await getAccount(req.params.id);
  if (!data) return res.status(404).send();
  res.json(data);
});

// =====================
// GET TRANSACTIONS
// =====================
router.get("/:id/transactions", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const data = await getTransactions(
    req.params.id,
    page,
    pageSize
  );

  res.json(data);
});

// =====================
// GET EVENTS (EVENT STORE)
// =====================
router.get("/:id/events", async (req, res) => {
  try {
    const events = await getEvents(req.params.id);

    res.json(
      events.map((e) => ({
        eventId: e.event_id,
        eventType: e.event_type,
        eventNumber: e.event_number,
        data: e.event_data,
        timestamp: e.timestamp,
      }))
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// =====================
// TIME TRAVEL (IMPORTANT)
// =====================
router.get("/:id/balance-at/:timestamp", async (req, res) => {
  try {
    const { id, timestamp } = req.params;

    // get event cutoff
    const cutoff = await db.query(
      `SELECT MAX(event_number) as num 
       FROM events 
       WHERE aggregate_id=$1 AND timestamp <= $2::timestamptz`,
      [id, timestamp]
    );

    const maxEvent = cutoff.rows[0].num;

    if (!maxEvent) {
      return res.json({
        accountId: id,
        balanceAt: 0,
        timestamp,
      });
    }

    // get events till that point
    const result = await db.query(
      `SELECT * FROM events 
       WHERE aggregate_id=$1 AND event_number <= $2
       ORDER BY event_number`,
      [id, maxEvent]
    );

    const state = buildState(result.rows);

    res.json({
      accountId: id,
      balanceAt: state.balance,
      timestamp,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;