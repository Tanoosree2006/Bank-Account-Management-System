const db = require("../db");

async function getAccount(accountId) {
  const res = await db.query(
    "SELECT * FROM account_summaries WHERE account_id=$1",
    [accountId]
  );
  return res.rows[0];
}

async function getTransactions(accountId, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;

  const res = await db.query(
    `SELECT * FROM transaction_history 
     WHERE account_id=$1 
     LIMIT $2 OFFSET $3`,
    [accountId, pageSize, offset]
  );

  return res.rows;
}

module.exports = { getAccount, getTransactions };