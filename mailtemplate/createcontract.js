const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));

class IndexerEmailService {
  async sendEmail(params) {

    try {
      let {
        contract_name,
        contract_type,
        created_at,
        contract_token,
        contract_start_date,
        contract_end_date,
        contract_from,
        contract_with,
        season_name,
        contract_with_emailId,
        contract_with_contact_number,
        contract_from_emailId,
        contract_from_contact_number
      } = params;

      const input = fs
        .readFileSync(path.join(__dirname, "createcontract.html"), "utf8")
        .toString();
      //const input = fs.readFileSync("./index.html", 'utf8').toString();

      const template = handlebars.compile(input);
      if (contract_type === "Team") {
        const replacements = {
          contract_name: contract_name,
          contract_type: contract_type,
          creation_date: created_at,
          contract_token: contract_token,
          contract_start_date: contract_start_date,
          contract_end_date: contract_end_date,
          contract_from: contract_from,
          contract_with: contract_with,
          season_name: season_name,
          contract_with_emailId: contract_with_emailId,
          contract_with_contact_number: contract_with_contact_number,
          contract_from_emailId: contract_from_emailId,
          contract_from_contact_number: contract_from_contact_number,
        };

        const htmlToSend = template(replacements);

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "username", //techmgclinfo@techmahindra.com
            pass: "userpassword",
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <username>', // sender address
          to: [contract_with_emailId,contract_from_emailId], // list of receivers
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info)
          }
        });
        return;
      }
      if ((contract_type === "Player")) {
        const replacements = {
          contractName: contract_name,
          contract_type: contract_type,
          creation_date: created_at,
          contract_token: contract_token,
          contract_start_date: contract_start_date,
          contract_end_date: contract_end_date,
          contract_from: contract_from,
          contract_with: contract_with,
          season_name: season_name,
          contract_with_emailId: contract_with_emailId,
          contract_with_contact_number: contract_with_contact_number,
          contract_from_emailId: contract_from_emailId,
          contract_from_contact_number: contract_from_contact_number,
        };

        const htmlToSend = template(replacements);

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "username", //techmgclinfo@techmahindra.com
            pass: "userpassword",
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <username>', // sender address
          to: [contract_with_emailId,contract_from_emailId],
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info)
          }
        });
        return;
      }
      if ((contract_type === "Sponsor")) {
        const replacements = {
          contractName: contract_name,
          contract_type: contract_type,
          creation_date: created_at,
          contract_token: contract_token,
          contract_start_date: contract_start_date,
          contract_end_date: contract_end_date,
          contract_from: contract_from,
          contract_with: contract_with,
          season_name: season_name,
          contract_with_emailId: contract_with_emailId,
          contract_with_contact_number: contract_with_contact_number,
          contract_from_emailId: contract_from_emailId,
          contract_from_contact_number: contract_from_contact_number,
        };

        const htmlToSend = template(replacements);

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "username", //techmgclinfo@techmahindra.com
            pass: "userpassword",
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <username>', // sender address
          to: [contract_with_emailId,contract_from_emailId],
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info)
          }
        });
        return;
      }
      if ((contract_type === "Vendor")) {
        const replacements = {
          contractName: contract_name,
          contract_type: contract_type,
          creation_date: created_at,
          contract_token: contract_token,
          contract_start_date: contract_start_date,
          contract_end_date: contract_end_date,
          contract_from: contract_from,
          contract_with: contract_with,
          season_name: season_name,
          contract_with_emailId: contract_with_emailId,
          contract_with_contact_number: contract_with_contact_number,
          contract_from_emailId: contract_from_emailId,
          contract_from_contact_number: contract_from_contact_number,
        };

        const htmlToSend = template(replacements);

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "username", //techmgclinfo@techmahindra.com
            pass: "userpassword",
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <username>', // sender address
          to: [contract_with_emailId,contract_from_emailId],
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info)
          }
        });
        return;
      }
    } catch (error) {}
  }
}

module.exports = IndexerEmailService;
