import nodemailer from 'nodemailer';
import { NotificationService } from "medusa-interfaces";

class NodemailerService extends NotificationService {
    static identifier = "nodemailer";

    constructor({orderService}, options) {
        super();
        this.options = options;
        this.orderService = orderService;

        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            socketTimeout: 60000, // Increase the timeout to 60 seconds (adjust as needed)
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });
    }

    async sendNotification(eventName, eventData, attachmentGenerator) {
        if (eventName === 'order.placed') {
            const order = await this.orderService.retrieve(eventData.id);
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: order.email, // replace with the recipient's email
                subject: 'Order Placed',
                text: `Order with id ${eventData.id} has been placed.`
            };

            this.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }

    async resendNotification(eventName, eventData, attachmentGenerator) {
    if (eventName === 'order.placed') {
        const order = await this.orderService.retrieve(eventData.id);
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: order.email, // replace with the recipient's email
            subject: 'Order Placed',
            text: `Order with id ${eventData.id} has been placed.`
        };

        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}    
}

export default NodemailerService;