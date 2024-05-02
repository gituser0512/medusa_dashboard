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
  // {
  //   resolve: `medusa-plugin-meilisearch`,
  //   options: {
  //     config: {
  //       host: process.env.MEILISEARCH_HOST,
  //       apiKey: process.env.MEILISEARCH_API_KEY,
  //     },
  //     settings: {
  //       products: {
  //         indexSettings: {
  //           searchableAttributes: [
  //             "title", 
  //             "description",
  //             "variant_sku",
  //           ],
  //           displayedAttributes: [
  //             "title", 
  //             "description", 
  //             "variant_sku", 
  //             "thumbnail", 
  //             "handle",
  //           ],
  //         },
  //         primaryKey: "id",
  //         transform: (product) => ({ 
  //           id: product.id, 
  //           // other attributes...
  //         }),
  //       },
  //     },
  //   },
  // },
  {
    resolve: `medusa-fulfillment-shiprocket`,
    options: {
      channel_id: process.env.SHIPROCKET_CHANNEL_ID, 
      email: process.env.SHIPROCKET_EMAIL, 
      password: process.env.SHIPROCKET_PASSWORD, 
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ2NjMxNzAsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzE1MzMyMzYzLCJqdGkiOiJvbDJnU0lZdU1SQjUzZGpZIiwiaWF0IjoxNzE0NDY4MzYzLCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTcxNDQ2ODM2MywiY2lkIjo0NTA4MjQ0LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.SuvUNvsrRpjCR-_lsqslepoS1uvstoyJMExj5pICtf8", //(required. leave empty)
      pricing: 'calculated', //"flat_rate" or "calculated" (required)
      length_unit: 'cm', //"mm", "cm" or "inches" (required)
      multiple_items: 'single_shipment', //"single_shipment" or "split_shipment"(default) (required)
      inventory_sync: true, //true or false(default) (required)
      forward_action: 'create_order', //'create_fulfillment' or 'create_order'(default) (required)
      return_action: 'create_order', //'create_fulfillment' or 'create_order'(default) (required)
    }
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