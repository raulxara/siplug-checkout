import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { ReceivePagSeguroWebhookUseCase } from './receive-pagseguro-webhook.use-case';

@Injectable()
export class PagSeguroReconciliationWorker implements OnModuleInit, OnModuleDestroy {
  private timer?: ReturnType<typeof setInterval>;
  private running = false;
  private readonly logger = new Logger(PagSeguroReconciliationWorker.name);
  constructor(private readonly db: PrismaService, private readonly receiver: ReceivePagSeguroWebhookUseCase) {}
  onModuleInit() { this.timer = setInterval(() => void this.tick(), 60000); this.timer.unref(); }
  onModuleDestroy() { if (this.timer) clearInterval(this.timer); }
  private where() { return {status: {in: ['pending', 'authorized']}, created_at: {gte: new Date(Date.now() - 72 * 3600000)},
    api_credential: {provider: {in: ['pagseguro', 'pagbank']}, status: {in: ['active', 'inactive']}}}; }
  async forOrder(officeId: string, clientId: string, orderId: string) {
    const rows = await this.db.paymentTransaction.findMany({where: {...this.where(), office_id: officeId, client_id: clientId, external_reference: orderId}, take: 2});
    for (const tx of rows) await this.one(tx);
  }
  async tick() {
    if (this.running) return;
    this.running = true;
    try {
      const rows = await this.db.paymentTransaction.findMany({where: this.where(), orderBy: {updated_at: 'asc'}, take: 100});
      let count = 0;
      for (const tx of rows) {
        if (count >= 20) break;
        if (await this.one(tx)) count++;
      }
    } catch { this.logger.warn('PAGBANK_RECONCILIATION_SCAN_FAILED'); }
    finally { this.running = false; }
  }
  private async one(tx: any) {
    const state = tx.config?.pagbankReconciliation;
    if (!tx.api_credential_id || Number(state?.nextAttemptAt ?? 0) > Date.now() || Number(state?.attempts ?? 0) >= 96) return false;
    try { await this.receiver.reconcileExistingPayment(tx.unique_id, tx.api_credential_id); }
    catch { this.logger.warn('PAGBANK_RECONCILIATION_PENDING payment=' + tx.unique_id); }
    return true;
  }
}
