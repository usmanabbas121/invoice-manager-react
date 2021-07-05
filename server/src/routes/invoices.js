const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
var crypto = require("crypto");
let EmailsRef = require("../emails/emails");


// @desc    Register the invoice
const registerInvoice = async (req, res, next) => {
    const {
        client_name,
        client_email,
        client_phone,
        team_lead_name,
        team_lead_email,
        team_lead_phone,
        company_name,
        company_address,
        service_provider,
        project_name,
        project_tasks,
        time_duration,
        rate,
        currency,
        total,
        invoice_id,
        reciever_emails,
        sender_email,
        cc_email,
        bcc_email,
        email_subject,
        created_by
    } = req.body;

    console.log(sender_email, "to", reciever_emails, "cc", cc_email, "bcc", bcc_email, email_subject);

    const client = await pool.connect();
    try {
  
      let newInvoice = await client.query(
        `INSERT INTO invoices 
          (client_name, client_email, client_phone, team_lead_name, 
            team_lead_email, team_lead_phone, company_name, company_address,
            service_provider, project_name, project_tasks, time_duration, rate,
            currency, total, created_at,created_by) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [
            client_name,
            client_email,
            client_phone,
            team_lead_name,
            team_lead_email,
            team_lead_phone,
            company_name,
            company_address,
            service_provider,
            project_name,
            project_tasks,
            time_duration,
            rate,
            currency,
            total,
            new Date().toISOString(),
            created_by
        ]
      );

      const existingclient = await pool.query(
        `SELECT invoices.client_name FROM invoices 
          WHERE invoices.client_name = $1 AND 
          deleted_at IS NULL
           ORDER BY created_at DESC`,
          [client_name]
      );

      if (existingclient.rows.length > 0 && sender_email && reciever_emails && email_subject) {
        EmailsRef.oldClientInvoiceEmail(newInvoice.rows[0],sender_email, reciever_emails, cc_email, bcc_email,email_subject);
      }
      else if (existingclient.rows.length == 0 && sender_email && reciever_emails && email_subject) {
        EmailsRef.newClientInvoiceEmail(newInvoice.rows[0],sender_email, reciever_emails, cc_email, bcc_email,email_subject);
      }
      
      await client.query("COMMIT");
  
      next();
  
      return res.json({ invoice: "Success" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };

  // @desc    Update a user
const updateInvoice = async (req, res) => {
  const {
    client_name,
    client_email,
    client_phone,
    team_lead_name,
    team_lead_email,
    team_lead_phone,
    company_name,
    company_address,
    service_provider,
    project_name,
    project_tasks,
    time_duration,
    rate,
    currency,
    total,
    invoice_id,
    reciever_emails,
    sender_email,
    cc_email,
    bcc_email,
    email_subject,
    created_by
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

      let updateInvoice = await client.query(
        `UPDATE invoices SET client_name=$1, client_email=$2, client_phone=$3, team_lead_name=$4,
          team_lead_email=$5, team_lead_phone=$6, company_name=$7, company_address=$8, service_provider=$9,
          project_name=$10, project_tasks=$11, time_duration=$12, rate=$13, currency=$14, total=$15, updated_at= $16, updated_by=$17
          WHERE invoice_id=$18`,
        [
          client_name,
          client_email,
          client_phone,
          team_lead_name,
          team_lead_email,
          team_lead_phone,
          company_name,
          company_address,
          service_provider,
          project_name,
          project_tasks,
          time_duration,
          rate,
          currency,
          total,
          new Date().toISOString(),
          created_by,
          invoice_id,
        ]
      );

      let invoicedate = await client.query(
        `SELECT * FROM invoices WHERE invoice_id =$1`,[invoice_id]
      );

      if (sender_email && reciever_emails && email_subject) {
        EmailsRef.oldClientInvoiceEmail(invoicedate.rows[0],sender_email, reciever_emails, cc_email, bcc_email,email_subject);
      }

    await client.query("COMMIT");
    return res.json({ invoice: "Success"});
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    if (err.code == "23505") {
      res.status(500).send("Duplicate email entry");
    } else {
      res.status(500).send("Server error");
    }
  }
};

// @desc    Delete a user
const deleteInvoice = async (req, res) => {
  const id = req.params.id;
  const loggeduserid = req.params.loggeduserid;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const deleteInvoice = await client.query(
      "UPDATE invoices SET deleted_at = $1, deleted_by = $2 WHERE invoice_id = $3",
      [new Date().toISOString(), loggeduserid, id]
    );

    await client.query("COMMIT");
    return res
      .status(401)
      .json({ id: id, error: "delete this invoice" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).send({ error: "Server error" });
  }
};

// @desc    List of Invoices
const InvoicesList = async (req, res) => {
  try {
    const invoices = await pool.query(
      "SELECT * FROM invoices WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );

    if (invoices.rows.length === 0) {
      return res.status(401).json({ error: "No invoice is existing." });
    }

    return res.json({ invoices: invoices.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};


// @desc    Single Invoice
const SingleInvoiceData = async (req, res) => {
  const id = req.params.id;
  try {
    const invoicedetails = await pool.query(
      "SELECT * FROM invoices WHERE invoice_id = $1 AND deleted_at IS NULL",
      [id]
    );

    if (invoicedetails.rows.length === 0) {
      return res.status(401).json({ error: "No invoice is existing." });
    }

    return res.json({ invoicedetails: invoicedetails.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server error" });
  }
};

const InvoicesPerDay = async (req, res) => {
	try {
		const invoicesperday = await pool.query(
      `SELECT DISTINCT to_char(invoices.created_at, 'MM/DD/YYYY') AS date
        FROM invoices
        WHERE invoices.deleted_at IS NULL ORDER BY date DESC`);

		if (invoicesperday.rows.length === 0) {
			return res.status(401).json({ error: "No invoice is existing." });
		}

    return res.json({ invoicesperday: invoicesperday.rows });
    
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ error: "Server error" });
	}
};

const InvoicesClientWise = async (req, res) => {
	try {
		const invoicesclientwise = await pool.query(
      `SELECT DISTINCT invoices.client_name
        FROM invoices
        WHERE invoices.deleted_at IS NULL ORDER BY client_name DESC`);

		if (invoicesclientwise.rows.length === 0) {
			return res.status(401).json({ error: "No invoice is existing." });
		}

    return res.json({ invoicesclientwise: invoicesclientwise.rows });
    
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ error: "Server error" });
	}
};

const InvoicesServiceWise = async (req, res) => {
	try {
		const invoicesservicewise = await pool.query(
      `SELECT DISTINCT invoices.service_provider
        FROM invoices
        WHERE invoices.deleted_at IS NULL ORDER BY service_provider DESC`);

		if (invoicesservicewise.rows.length === 0) {
			return res.status(401).json({ error: "No invoice is existing." });
		}

    return res.json({ invoicesservicewise: invoicesservicewise.rows });
    
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ error: "Server error" });
	}
};


// @desc    Search invoice result
const searchInvoices = async (req, res) => {
	const param = req.query.info;

	try {
		const searchinvoiceresult = await pool.query(
			`SELECT invoices.invoice_id, invoices.client_name, to_char( invoices.created_at, 'MM/DD/YYYY') as creation_date, invoices.project_name, invoices.company_name, invoices.currency, invoices.total
              FROM invoices
               WHERE (invoices.client_name LIKE $1 OR invoices.client_email LIKE $1 
                OR invoices.project_name LIKE $1 OR invoices.company_name LIKE $1
                OR invoices.team_lead_name LIKE $1 OR invoices.currency LIKE $1 
                OR invoices.service_provider LIKE $1) 
               AND invoices.deleted_at IS NULL ORDER BY invoices.created_at DESC
            `,
			["%" + param + "%"]
		);

		if (searchinvoiceresult.rows.length === 0) {
			return res.status(401).json({ error: "No invoice is existing." });
		}

		return res.json({ searchinvoiceresult: searchinvoiceresult.rows });
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ error: "Server error" });
	}
};



  module.exports = {
    registerInvoice,
    updateInvoice,
    deleteInvoice,
    InvoicesList,
    SingleInvoiceData,
    InvoicesPerDay,
    searchInvoices,
    InvoicesClientWise,
    InvoicesServiceWise
  };