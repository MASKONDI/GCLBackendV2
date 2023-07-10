const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const app = express();
const dotenv = require("dotenv")
const port = 3000;

app.use(express.urlencoded({ extended: false }));

class StatusEmailService {
  async sendEmail(params) {
    try {
      let {
        contract_name,
        contract_type,
        contract_status,
        contract_token,
        action_by,
        updated_at,
        season_name,
        comment,
        contract_with_emailId,
        contract_with_contact_number,
        contract_from_emailId,
        contract_from_contact_number,
      } = params;

      if (contract_status === "approved") {
        const input = fs
          .readFileSync(path.join(__dirname, "approval.html"), "utf8")
          .toString();

        const template = handlebars.compile(input);
        const replacements = {
          contractName: contract_name,
          contract_type: contract_type,
          contract_status: contract_status,
          contract_token: contract_token,
          action_by: action_by,
          action_date: updated_at,
          season_name: season_name,
          comment: comment,
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
            user: process.env.USER_NAME, //techmgclinfo@techmahindra.com
            pass: process.env.USER_PASSWORD,
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <noreplygcltest@gmail.com>', // sender address
          to: [contract_with_emailId, contract_from_emailId], // list of receivers
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info);
          }
        });
        return;
      }
      if (contract_status === "reject") {
        const input = fs
          .readFileSync(path.join(__dirname, "rejection.html"), "utf8")
          .toString();

        const template = handlebars.compile(input);
        const replacements = {
          contractName: contract_name,
          contract_type: contract_type,
          contract_status: contract_status,
          contract_token: contract_token,
          action_by: action_by,
          action_date: updated_at,
          season_name: season_name,
          comment: comment,
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
            user: process.env.USER_NAME, //techmgclinfo@techmahindra.com
            pass: process.env.USER_PASSWORD,
          },
        });
        var mailOptions = {
          from: '"GCL INFO" <mailid>', // sender address
          to: [contract_with_emailId, contract_from_emailId],
          subject: "Tech Mahindra GCL Contract Notification", // Subject line
          html: htmlToSend, // html body
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(info);
          }
        });
        return;
      }
    } catch (error) {}
  }
}

module.exports = StatusEmailService;
