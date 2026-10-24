/**
 * WhatsApp click-to-chat (wa.me) helpers. No API or key: the link opens
 * WhatsApp (app on mobile, WhatsApp Web on desktop) with the text typed in;
 * the user presses Send.
 */

/**
 * WhatsApp number in international format, digits only ("917234090000").
 * Reads the CMS WhatsApp link (wa.me/<number> or …?phone=<number>), else the
 * phone number ("+91-723-409-0000"). "" when neither has a number.
 */
export function whatsappNumber(link: string, phone = "") {
  const fromLink = link.match(/wa\.me\/(\d{8,15})(?:[/?#]|$)/)?.[1] ?? link.match(/[?&]phone=(\d{8,15})/)?.[1];
  if (fromLink) return fromLink;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 ? digits : "";
}

/** https://wa.me/<number>?text=<message>, with the whole message URL-encoded. */
export function whatsappChatUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
