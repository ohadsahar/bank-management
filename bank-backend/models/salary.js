const mongoose = require('mongoose');

const financialIncome = mongoose.Schema({

  salary: { type: Number, required: true },
  monthOfSalary: { type: String, required: true },
});

module.exports = mongoose.model('financialIncome', financialIncome);
