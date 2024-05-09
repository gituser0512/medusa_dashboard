const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      aws_config_object: {},
    },
  },
  {
    resolve: `medusa-fulfillment-shiprocket`,
    options: {
      channel_id: process.env.SHIPROCKET_CHANNEL_ID,
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
      token: "", //(required. leave empty)
      pricing: "calculated", //"flat_rate" or "calculated" (required)
      length_unit: "cm", //"mm", "cm" or "inches" (required)
      multiple_items: "single_shipment", //"single_shipment" or "split_shipment"(default) (required)
      inventory_sync: false, //true or false(default) (required)
      forward_action: "create_fulfillment", //'create_fulfillment' or 'create_order'(default) (required)
      return_action: "create_fulfillment", //'create_fulfillment' or 'create_order'(default) (required)
    },
  },
  {
    resolve: `medusa-plugin-resend`,
    options: {
      api_key: process.env.RESEND_API_ID,
      from: "jay.mehta@intelliconnectq.com",
      enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
      template_path: "./src/email-templates/order-created.tsx",
      subject_template_type: "text",
      body_template_type: "react",
      order_placed_template: "order_placed",
      order_shipped_template: "order_shipped",
      customer_password_reset_template: "customer_password_reset",
      gift_card_created_template: "gift_card_created",
      //order_canceled_template: 'order_canceled',
      //order_refund_created_template: 'order_refund_created',
      //order_return_requested_template: 'order_return_requested',
      //order_items_returned_template: 'order_items_returned',
      //swap_created_template: 'swap_created',
      //swap_shipment_created_template: 'swap_shipment_created',
      //swap_received_template: 'swap_received',
      //claim_shipment_created_template: 'claim_shipment_created',
      //user_password_reset_template: 'user_password_reset',
      //medusa_restock_template: 'medusa_restock',
    },
  },
];

const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
