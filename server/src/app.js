const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const adminRoutes = require('./modules/admin/admin.routes');
const companyRoutes= require('./modules/company/company.routes');
const productRoutes= require('./modules/product/product.routes');
const clientRoutes= require('./modules/client/client.routes');
const orderRoutes= require('./modules/order/order.routes');

const errorMiddleware = require('./middleware/error.middleware');
const cookieParser = require("cookie-parser");
const { rateLimitMiddleware } = require('./middleware/rateLimit.middleware');
const { clientApi, companyApi, productApi, orderApi, adminApi } = require('./config/env');
const app = express();

/* -------------------- Global Middlewares -------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
   credentials: true
}));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);
app.use(rateLimitMiddleware);

app.use(cookieParser());
/* -------------------- Basic route Check -------------------- */

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

/* -------------------- Routes -------------------- */

app.use(adminApi, adminRoutes);
app.use(companyApi, companyRoutes);
app.use(productApi, productRoutes);
app.use(clientApi, clientRoutes);
app.use(orderApi, orderRoutes);



/* -------------------- Error Handler -------------------- */

app.use(errorMiddleware);

module.exports = app;