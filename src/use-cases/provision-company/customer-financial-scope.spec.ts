import { ListSubscriptionsByOfficeIdUseCase } from '../list-subscriptions-by-office-id/list-subscriptions-by-office-id.use-case';
import { ListSubscriptionInvoicesByOfficeIdUseCase } from '../list-subscription-invoices-by-office-id/list-subscription-invoices-by-office-id.use-case';
import { ListSubscriptionPlansByOfficeIdUseCase } from '../list-subscription-plans-by-office-id/list-subscription-plans-by-office-id.use-case';
describe('Customer financial tenant scope',()=>{
 for(const UseCase of [ListSubscriptionsByOfficeIdUseCase,ListSubscriptionInvoicesByOfficeIdUseCase,ListSubscriptionPlansByOfficeIdUseCase]){
  it(UseCase.name+' rejects another company before querying records',async()=>{
   const identity={exec:jest.fn().mockResolvedValue({officeId:'own'})};
   const reader={exec:jest.fn()};
   const permission={exec:jest.fn()};
   const usecase=new UseCase(identity as never,reader as never,permission as never);
   await expect(usecase.exec({token:'private',officeId:'foreign'} as never)).rejects.toThrow('office not authorized');
   expect(reader.exec).not.toHaveBeenCalled();expect(permission.exec).not.toHaveBeenCalled();
  });
 }
});
