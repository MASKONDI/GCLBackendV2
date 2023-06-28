
const nodemailer = require('nodemailer');
const path = require("path")
const fs = require('fs');
const handlebars = require('handlebars');
class IndexerEmailService {
    async sendEmail() {

            //let { artist_name,contract_address,tokenId,categoryId,email_id, token_name } = params;
           
            const input = fs.readFileSync(path.join(__dirname, "index.html"), 'utf8').toString();
            //const input = fs.readFileSync("./index.html", 'utf8').toString();
            const template = handlebars.compile(input);
            
            const replacements = {
                contract_name: 'ABC',
                contract_with: 'GCL',
                tokenId: 'tokedvahshdgjasbfbnjsafkdkjfhjsdanId',
                season: '1',
                status: 'approved',
            };
            console.log("replacements",replacements)
            const htmlToSend = template(replacements);
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: '',
                    pass: '',
                },
            });
            console.log("created transporter");
            var mailOptions = {
                to: '',      
                cc:'',
                subject: "GCL Notification",
                html: htmlToSend,
               
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                  
                }
            });
            console.log("mail send")
            return
          
           
        }
    }


module.exports = IndexerEmailService;
