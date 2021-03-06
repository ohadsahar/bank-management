const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || '3000';
const config = require('./utils/config');
const transactionRoute = require('./routes/transactions');
const paymentRoute = require('./routes/payment');
const salaryRoute = require('./routes/salary');
const loginRoute = require('./routes/login');
const connection = require('./dev');

connection.connectMongoDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(config.cors));
app.listen(PORT, () => {
  console.log(`Server is on, via port: ${PORT}`);
});

app.use('/api/salary', salaryRoute);
app.use('/api/bank', transactionRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/login', loginRoute);
module.exports = app;
