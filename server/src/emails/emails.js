var nodemailer = require("nodemailer");

module.exports.newClientInvoiceEmail = function (result, to, from, cc, bcc, subject) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	var mailOptions = {
		from: from,
		to: to,
		cc: cc,
		bcc: bcc,
		subject: subject,
		html:
			"Operations,<br>" +
			"<br><br>Please Setup and invoice a new client: <b>"+result.client_name+" </b> with following project and billing information: " +	
			"<b>Client Name: </b>"+result.client_name+"<br>"+
			"<b>Client Email: </b>"+result.client_email+"<br>"+
			"<b>Client Phone: </b>"+result.client_phone+"<br>"+
			"<b>Team Lead Name: </b>"+result.team_lead_name+"<br>"+
			"<b>Team Lead Email: </b>"+result.team_lead_email+"<br>"+
			"<b>Team Lead Phone: </b>"+result.team_lead_phone+"<br>"+
			"<b>Company: </b>"+result.company_name+"<br>"+
			"<b>Address: </b>"+result.company_address+"<br>"+
			"<b>Service: </b>"+result.service_provider+"<br>"+
			"<b>Project: </b>"+result.project_name+"<br>"+
			"<b>Tasks: </b>"+result.project_tasks+"<br>"+
			"<b>Time Duration: </b>"+result.time_duration+" Hours<br>"+
			"<b>Rate: </b>"+result.rate+"<br> /hour"+
			"<b>Currency: </b>"+result.currency+"<br>"+
			"<b>Total: </b>"+result.total+"<br>"+
			"Please Invoice in full.<br>"+
			"<br>Thanks,<br>"+
			"<br>--<br>"
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return error;
		} else {
			return "Check your email for the confirmation link";
		}
	});
};


module.exports.oldClientInvoiceEmail = function (result, to, from, cc, bcc, subject) {
	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	var mailOptions = {
		from: from,
		to: to,
		cc: cc,
		bcc: bcc,
		subject: subject,
		html:
			"Hi, Billing Team," +
			"<br><br>Please Invoice the following returning client in " +
			result.service_provider +
			" Freshbooks:" +
			"<br><br> Billing Information:<br>" +
			"<b>Client Name: </b>"+result.client_name+"<br>"+
			"<b>Client Email: </b>"+result.client_email+"<br>"+
			"<b>Client Phone: </b>"+result.client_phone+"<br>"+
			"<b>Team Lead Name: </b>"+result.team_lead_name+"<br>"+
			"<b>Team Lead Email: </b>"+result.team_lead_email+"<br>"+
			"<b>Team Lead Phone: </b>"+result.team_lead_phone+"<br>"+
			"<b>Company: </b>"+result.company_name+"<br>"+
			"<b>Address: </b>"+result.company_address+"<br>"+
			"<b>Service: </b>"+result.service_provider+"<br>"+
			"<b>Project: </b>"+result.project_name+"<br>"+
			"<b>Tasks: </b>"+result.project_tasks+"<br>"+
			"<b>Time Duration: </b>"+result.time_duration+" Hours<br>"+
			"<b>Rate: </b>"+result.rate+"/hour <br> "+
			"<b>Currency: </b>"+result.currency+"<br>"+
			"<b>Total: </b>"+result.total+"<br>"+
			"Please Invoice in full.<br>"+
			"<br>Thanks,<br>"+
			"<br>--<br>"
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return error;
		} else {
			return "Check your email for the confirmation link";
		}
	});
};
