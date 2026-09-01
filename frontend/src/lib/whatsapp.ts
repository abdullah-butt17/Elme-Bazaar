import { formatPrice } from "@/lib/utils";

/**
 * Cleans a WhatsApp number for wa.me links.
 *
 * Examples:
 * +92 300 1234567  -> 923001234567
 * 92300-1234567    -> 923001234567
 */
function cleanWhatsAppNumber(number?: string): string {
  if (!number) return "";

  return number.replace(/\D/g, "");
}

/**
 * Creates a WhatsApp URL for a specific product.
 *
 * The WhatsApp number should be passed from Admin Settings:
 *
 * buildWhatsAppUrl(
 *   product.name,
 *   product.salePrice ?? product.price,
 *   settings?.whatsappNumber
 * )
 */
export function buildWhatsAppUrl(
  productName: string,
  price?: number,
  numberOverride?: string
): string {
  const number = cleanWhatsAppNumber(numberOverride);

  // No hardcoded WhatsApp number.
  // If Admin Settings does not contain a number,
  // don't create an invalid WhatsApp link.
  if (!number) {
    return "#";
  }

  const msg = [
    "Hello,",
    "I am interested in this product.",
    "",
    `Product: ${productName}`,
    price !== undefined
      ? `Price: ${formatPrice(price)}`
      : null,
    "",
    "Please let me know if it is available.",
    "Thank you.",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

/**
 * Creates a general WhatsApp contact URL.
 *
 * The WhatsApp number should also be passed
 * from Admin Settings.
 */
export function generalWhatsAppUrl(
  message = "Hello, I would like to know more about ELME Bazaar.",
  numberOverride?: string
): string {
  const number = cleanWhatsAppNumber(numberOverride);

  if (!number) {
    return "#";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}