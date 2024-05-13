import nodemailer from 'nodemailer';
import { NotificationService } from "medusa-interfaces";
import Instagram from '../images/instagram.svg';
import Youtube from '../images/youtube.svg'

class NodemailerService extends NotificationService {
    static identifier = "nodemailer";

    constructor({ orderService }, options) {
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
                subject: `Your request for order ${eventData.id} has been received.`,
                // text: `Order with id ${eventData.id} has been placed.`,
                html: `
                <div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
                <h2 style="color: #0077b6;">Hey ${eventData},</h2>
                <p>Thank you for your inquiry. Our team will reach out to you shortly.</p>
                <a href="https://www.shopntrolly.com/in/account/orders" style="display: inline-block; background-color: #0077b6; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">VIEW OR MANAGE ORDER</a>
            
                <p><strong>Your Request Id ${eventData.id} has been placed.</strong></p>
                <p>You can make your shopping experience easier, quicker and more personal - access your order history, get recommended products, exclusive offers, wishlist collections and more simply by creating an exclusive account.</p>
                <p>Say hello to us! Drop in an email on <a href="mailto:hello@mail.shotntrolly.com" style="color: #0077b6;">hello@mail.shotntrolly.com</a> or call us on [] (We're available from 9 am to 5 pm on all days).</p>
                <p>Thanks,<br>ShopNtrolly</p>
                <div style="display: flex; align-items: center; margin-top: 20px;">
                Connect with us
                <a
                  href="https://www.instagram.com/shopandtrolly/"
                  target="_blank"
                  rel="ShopNTrolly website"
                >
                  <img src=${Instagram} alt="" style="width: 30px; height: 30px;">
                </a>
                &
                <a
                  href="https://www.youtube.com/@shopntrolly"
                  target="_blank"
                  rel="ShopNTrolly website"
                >
                    <img src=${youtube} alt="" style="width: 30px; height: 30px;">
                </a>
                </div>
              </div>
        `

            };

            this.transporter.sendMail(mailOptions, function (error, info) {
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
                html: `
                <div style="font-family: Arial, sans-serif; color: #333333; line-height: 1.5;">
                <h2 style="color: #0077b6;">Hey [First Name],</h2>
                <p>Thank you for your inquiry. Our team will reach out to you shortly.</p>
                <a href="#" style="display: inline-block; background-color: #0077b6; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">VIEW OR MANAGE ORDER</a>
                <p><strong>Your Request #725253480</strong></p>
                <p><strong>Order with id ${eventData.id} has been placed.</strong></p>
                <p>You can make your shopping experience easier, quicker and more personal - access your order history, get recommended products, exclusive offers, wishlist collections and more simply by creating an exclusive account.</p>
                <p>Say hello to us! Drop in an email on <a href="mailto:hello@mail.shotntrolly.com" style="color: #0077b6;">hello@mail.shotntrolly.com</a> or call us on [] (We're available from 9 am to 5 pm on all days).</p>
                <p>Thanks,<br>ShopNtrolly</p>
                <p>Social Media Logos and URL</p>
              </div>
              `
            };

            this.transporter.sendMail(mailOptions, function (error, info) {
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