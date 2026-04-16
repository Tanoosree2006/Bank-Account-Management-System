function buildState(events) {
  let state = {
    balance: 0,
    status: "OPEN",
    ownerName: "",
    currency: "USD",
  };

  for (let e of events) {
    const data = e.event_data;

    switch (e.event_type) {
      case "AccountCreated":
        state.ownerName = data.ownerName;
        state.currency = data.currency;
        state.balance = Number(data.initialBalance) || 0; // ✅ FIX
        break;

      case "MoneyDeposited":
        state.balance += Number(data.amount) || 0; // ✅ FIX
        break;

      case "MoneyWithdrawn":
        state.balance -= Number(data.amount) || 0; // ✅ FIX
        break;

      case "AccountClosed":
        state.status = "CLOSED"; // ✅ FIX
        break;
    }
  }

  return state;
}

module.exports = { buildState };