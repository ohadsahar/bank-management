const mongoose = require('mongoose');

const financialIncome = mongoose.Schema({
  username: { type: String, required: true },
  salary: { type: Number, required: true },
  monthOfSalary: { type: String, required: true },
});

module.exports = mongoose.model('financialIncome', financialIncome);
