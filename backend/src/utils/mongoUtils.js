const mongoose = require('mongoose');

async function serverSupportsTransactions() {
  try {
    const admin = mongoose.connection.db.admin();
    const info = await admin.command({ ismaster: 1 });
    return !!info.setName;
  } catch (err) {
    return false;
  }
}
module.exports = { serverSupportsTransactions };