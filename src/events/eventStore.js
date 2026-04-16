const db = require("../db");

async function appendEvent(event) {
  const { aggregate_id } = event;

  const result = await db.query(
    `SELECT COALESCE(MAX(event_number),0)+1 as num FROM events WHERE aggregate_id=$1`,
    [aggregate_id]
  );

  const eventNumber = result.rows[0].num;

  await db.query(
    `INSERT INTO events (aggregate_id, aggregate_type, event_type, event_data, event_number)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      aggregate_id,
      "BankAccount",
      event.event_type,
      event.event_data,
      eventNumber,
    ]
  );

  return eventNumber;
}

async function getEvents(aggregateId) {
  const res = await db.query(
    "SELECT * FROM events WHERE aggregate_id=$1 ORDER BY event_number",
    [aggregateId]
  );
  return res.rows;
}

module.exports = { appendEvent, getEvents };