import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { DecryptApiCredentialSecretService } from "../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service";
import { DecryptApiCredentialSecretDtoIn } from "../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in";
@Injectable()
export class MercadoPagoRefundService {
  constructor(private readonly crypto: DecryptApiCredentialSecretService) {}
  private token(encrypted: string) {
    const d = this.crypto.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: { config: { token: encrypted } },
        keysToDecrypt: ["token"],
        strict: true,
      }),
    );
    return String(
      (d.apiCredential.config as Record<string, unknown>).token ?? "",
    );
  }
  async cancelSubscription(
    encrypted: string,
    id: string,
    reference: string,
  ): Promise<void> {
    const url =
      "https://api.mercadopago.com/preapproval/" + encodeURIComponent(id);
    const headers = {
      Authorization: "Bearer " + this.token(encrypted),
      "Content-Type": "application/json",
    };
    const current = await fetch(url, {
      headers,
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!current.ok)
      throw new ServiceUnavailableException("SUBSCRIPTION_REVIEW");
    const c = (await current.json()) as {
      id: string;
      external_reference: string;
      status: string;
    };
    if (c.id !== id || c.external_reference !== reference)
      throw new BadRequestException("SUBSCRIPTION_MISMATCH");
    if (c.status === "cancelled") return;
    if (!["authorized", "paused", "pending"].includes(c.status))
      throw new BadRequestException("SUBSCRIPTION_STATE");
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: "cancelled" }),
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new ServiceUnavailableException("SUBSCRIPTION_REVIEW");
    const r = (await response.json()) as { id: string; status: string };
    if (r.id !== id || r.status !== "cancelled")
      throw new ServiceUnavailableException("SUBSCRIPTION_REVIEW");
  }
  async request(
    encrypted: string,
    payment: string,
    method: "GET" | "POST",
    key?: string,
    amount?: number,
    refund?: string,
  ): Promise<Record<string, unknown>> {
    if (!/^\d+$/.test(payment))
      throw new BadRequestException("REFUND_PAYMENT_INVALID");
    const url =
      "https://api.mercadopago.com/v1/payments/" +
      payment +
      (method === "POST" || refund ? "/refunds" : "") +
      (refund ? "/" + encodeURIComponent(refund) : "");
    const response = await fetch(url, {
      method,
      redirect: "error",
      signal: AbortSignal.timeout(20000),
      headers: {
        Authorization: "Bearer " + this.token(encrypted),
        "Content-Type": "application/json",
        ...(key ? { "X-Idempotency-Key": key } : {}),
      },
      ...(method === "POST"
        ? { body: JSON.stringify({ amount: amount! / 100 }) }
        : {}),
    });
    if (!response.ok)
      throw new ServiceUnavailableException("REFUND_GATEWAY_REVIEW");
    return (await response.json()) as Record<string, unknown>;
  }
}
