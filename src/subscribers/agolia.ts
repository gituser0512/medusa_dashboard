import { ProductService, type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa";

export default async function productUpdateHandler({ data, eventName, container, pluginOptions }: SubscriberArgs<Record<string, any>>) {
  console.log("\n\nPRODUCT UPDATE EVENT!\n\n");
}

export const config: SubscriberConfig = {
  event: ProductService.Events.UPDATED,
  context: {
    subscriberId: "product-update-handler-algolia",
  },
};