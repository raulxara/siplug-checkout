import { ReceivePagSeguroWebhookUseCase } from './receive-pagseguro-webhook.use-case';
import { ReceivePagSeguroShortWebhookController } from './receive-pagseguro-short-webhook.controller';
import { ReceivePagSeguroWebhookController } from './receive-pagseguro-webhook.controller';

describe('PagBank deferred webhook response', () => {
  it.each([ReceivePagSeguroShortWebhookController, ReceivePagSeguroWebhookController])('reports received and queued, never processed, on %p', async Controller => {
    const receiver = Object.create(ReceivePagSeguroWebhookUseCase.prototype);
    receiver.verification = {verifyNotification: jest.fn().mockResolvedValue({deferred:true,transactionId:'payment',nextAttemptAt:Date.now()+60000})};
    receiver.processVerified = jest.fn();
    const controller = new Controller(receiver);
    const result = await controller.handle('credential',{reference_id:'order'},{},{rawBody:Buffer.from('{"reference_id":"order"}')} as never);
    expect(result).toMatchObject({received:true,processed:false,queued:true});
    expect(receiver.processVerified).not.toHaveBeenCalled();
  });
});
