import { Region } from "@medusajs/medusa";
import type Medusa from "@medusajs/medusa-js"

export default async function prepareShippingOptions (client: Medusa, region: Region) {
  let { shipping_options } = await client.admin.shippingOptions.list({
    region_id: region.id
  })
  if (!shipping_options.length) {
    shipping_options = [(await client.admin.shippingOptions.create({
      "name": "Medusa Shiprocket",
      "region_id": region.id,
      "provider_id": "shiprocket",
      "data": {
        "id": "medusa-fulfillment-shipment"
      },
      // @ts-ignore
      "price_type": "calculated",
      "amount": 1000
    })).shipping_option]
  }

  return shipping_options
}