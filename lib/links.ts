import { WHATSAPP } from "./config";
import { MENSAGEM_SIMPLES, urlWhatsApp } from "./whatsapp";

/** wa.me com a mensagem simples ("Vim pelo site…"). A mensagem da comanda só sai pelo painel. */
export const URL_ZAP_SIMPLES = urlWhatsApp(WHATSAPP, MENSAGEM_SIMPLES);
