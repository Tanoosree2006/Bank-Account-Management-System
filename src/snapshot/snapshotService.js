const db = require("../db");

async function saveSnapshot(aggregateId, state, eventNumber) {
  await db.query(
    `INSERT INTO snapshots (aggregate_id, snapshot_data, last_event_number)
     VALUES ($1,$2,$3)
     ON CONFLICT (aggregate_id)
     DO UPDATE SET snapshot_data=$2, last_event_number=$3`,
    [aggregateId, state, eventNumber]
  );
}

async function getSnapshot(aggregateId) {
  const res = await db.query(
    "SELECT * FROM snapshots WHERE aggregate_id=$1",
    [aggregateId]
  );
  return res.rows[0];
}


module.exports = { saveSnapshot, getSnapshot };