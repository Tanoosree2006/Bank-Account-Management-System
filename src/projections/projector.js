const db = require("../db");

async function project(event) {
  const data = event.event_data;

  switch (event.event_type) {
    case "AccountCreated":
      await db.query(
        `INSERT INTO account_summaries 
        (account_id, owner_name, balance, currency, status, version)
        VALUES ($1,$2,$3,$4,'OPEN',1)`,
        [
          event.aggregate_id,
          data.ownerName,
          data.initialBalance,
          data.currency,
        ]
      );
      break;

    case "MoneyDeposited":
      await db.query(
        `UPDATE account_summaries 
         SET balance = balance + $1 
         WHERE account_id=$2`,
        [data.amount, event.aggregate_id]
      );

      await db.query(
        `INSERT INTO transaction_history 
        VALUES ($1,$2,'DEPOSIT',$3,$4,NOW())`,
        [data.transactionId, event.aggregate_id, data.amount, data.description]
      );
      break;

    case "MoneyWithdrawn":
      await db.query(
        `UPDATE account_summaries 
         SET balance = balance - $1 
         WHERE account_id=$2`,
        [data.amount, event.aggregate_id]
      );

      await db.query(
        `INSERT INTO transaction_history 
        VALUES ($1,$2,'WITHDRAW',$3,$4,NOW())`,
        [data.transactionId, event.aggregate_id, data.amount, data.description]
      );
      break;

    case "AccountClosed":
      await db.query(
        `UPDATE account_summaries 
         SET status='CLOSED' WHERE account_id=$1`,
        [event.aggregate_id]
      );
      break;
  }
}

module.exports = { project };