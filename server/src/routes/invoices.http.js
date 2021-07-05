const express = require("express");
const router = express.Router();
let validate = require("../middleware/connection");

const {
    registerInvoice,
    updateInvoice,
    deleteInvoice,
    InvoicesList,
    SingleInvoiceData,
    InvoicesPerDay,
    InvoicesClientWise,
    InvoicesServiceWise,
    searchInvoices
  } = require("./invoices");

// @route   POST /invoice/regiser
// @desc    Register the invoice
router.post("/register", registerInvoice);
  
// @route   POST /invoice/update
// @desc    Update the invoice
router.post("/update", updateInvoice);

// @route   DELETE /invoice/delete/:id/:loggeduserid
// @desc    Delete the invoice
router.delete("/delete/:id/:loggeduserid", deleteInvoice);

// @route   GET /invoice/invoice-list
// @desc    List of invoices
router.get("/invoice-list", InvoicesList);

// @route   GET /invoice/invoice-data
// @desc    single invoice data
router.get("/invoice-details-page/:id", SingleInvoiceData);

// @route   GET /invoice/invoices-per-day
// @desc    List of invoices per day
router.get("/invoices-per-day", InvoicesPerDay);

// @route   GET /invoice/invoices-client-wise
// @desc    List of invoices client wise
router.get("/invoices-client-wise", InvoicesClientWise);

// @route   GET /invoice/invoices-service-wise
// @desc    List of invoices service wise
router.get("/invoices-service-wise", InvoicesServiceWise);

// @route   GET /invoice/invoices-search/:value"
// @desc    List of cases
router.get("/invoices-search", searchInvoices);


module.exports = router;