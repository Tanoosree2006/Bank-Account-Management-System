const { appendEvent, getEvents } = require("../events/eventStore");
const { buildState } = require("../utils/stateBuilder");
const { project } = require("../projections/projector");

async function createAccount(data) {
  const events = await getEvents(data.accountId);
  if (events.length) throw new Error("Account exists");

  const event = {
    aggregate_id: data.accountId,
    event_type: "AccountCreated",
    event_data: data,
  };

  await appendEvent(event);
  await project(event);
}

async function deposit(accountId, data) {
  const event = {
    aggregate_id: accountId,
    event_type: "MoneyDeposited",
    event_data: data,
  };

  await appendEvent(event);
  await project(event);
}

async function withdraw(accountId, data) {
  const events = await getEvents(accountId);
  const state = buildState(events);

  if (state.balance < data.amount)
    throw new Error("Insufficient balance");

  const event = {
    aggregate_id: accountId,
    event_type: "MoneyWithdrawn",
    event_data: data,
  };

  await appendEvent(event);
  await project(event);
}

async function closeAccount(accountId) {
  const events = await getEvents(accountId);
  const state = buildState(events);

  if (state.balance !== 0)
    throw new Error("Balance not zero");

  const event = {
    aggregate_id: accountId,
    event_type: "AccountClosed",
    event_data: {},
  };

  await appendEvent(event);
  await project(event);
}

module.exports = { createAccount, deposit, withdraw, closeAccount };