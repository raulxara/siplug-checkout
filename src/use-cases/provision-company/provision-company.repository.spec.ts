import { ProvisionCompanyRepository } from './provision-company.repository';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { ProvisionCompanyRequest } from './dtos/provision-company.request';
describe('Dedicated company provisioning', () => {
 const previous=process.env.SIPLUG_PROVISIONING_OFFICE_ID;
 afterEach(()=>{if(previous===undefined)delete process.env.SIPLUG_PROVISIONING_OFFICE_ID;else process.env.SIPLUG_PROVISIONING_OFFICE_ID=previous;});
 const input={firstName:'Test',lastName:'Customer',email:'new@example.test',phone:'5511999999999',username:'new@example.test',password:'StrongPassword123!',office:{name:'Customer',slug:'customer',language:'pt-BR',currency:'BRL'}} as ProvisionCompanyRequest;
 it('denies a credential outside the approved source office',async()=>{
  process.env.SIPLUG_PROVISIONING_OFFICE_ID='platform';const db={client:{findFirst:jest.fn().mockResolvedValue(null)},$transaction:jest.fn()};
  await expect(new ProvisionCompanyRepository(db as unknown as PrismaService).create('foreign','key',input)).rejects.toThrow();expect(db.$transaction).not.toHaveBeenCalled();
 });
 it('creates a dedicated customer office and replays without duplicate writes',async()=>{
  process.env.SIPLUG_PROVISIONING_OFFICE_ID='platform';let saved:any=null;let customer:any=null;
  const tx={$queryRaw:jest.fn().mockResolvedValue([{_id:'platform'}]),office:{findUnique:jest.fn(async()=>saved),create:jest.fn(async({data})=>{saved={...data,status:'active'};return saved;})},profile:{create:jest.fn()},client:{create:jest.fn()},position:{create:jest.fn()},userPosition:{create:jest.fn()},userCustomer:{create:jest.fn(async({data})=>{customer={...data,status:'active'};return customer;}),findUnique:jest.fn(async()=>customer)}};
  const db={client:{findFirst:jest.fn().mockResolvedValue({unique_id:'admin'})},$transaction:jest.fn(async fn=>fn(tx))};const repository=new ProvisionCompanyRepository(db as unknown as PrismaService);
  const a=await repository.create('admin','new-office',input);const b=await repository.create('admin','new-office',input);expect(a).toEqual(b);expect(a.officeId).toBe('new-office');expect(tx.office.create).toHaveBeenCalledTimes(1);expect(tx.position.create).toHaveBeenCalledWith({data:expect.objectContaining({office_id:'new-office',slug:'customer'})});expect(tx.client.create.mock.calls[0][0].data.password).not.toBe(input.password);
  await expect(repository.create('admin','new-office',{...input,email:'other@example.test'})).rejects.toThrow();expect(tx.office.create).toHaveBeenCalledTimes(1);
 });
});
