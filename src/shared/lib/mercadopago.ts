import { MercadoPagoConfig } from "mercadopago";

let mpClient: MercadoPagoConfig | null = null;

export function getMercadoPago(): MercadoPagoConfig | null {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return null;
  }

  if (!mpClient) {
    mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });
  }

  return mpClient;
}

export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}
