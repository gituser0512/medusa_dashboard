class OrderSubscriber {
    constructor({ notificationService }) {
        notificationService.subscribe("order.placed", "nodemailer");
    }
  }
  
  export default OrderSubscriber;