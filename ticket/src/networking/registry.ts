import Consul from 'consul';

let consul: Consul.Consul;

export const registerService = async (
  serviceName: string,
  address: string,
  port: number,
): Promise<void> => {
  consul = new Consul({ host: 'consul', port: '8500' });
  await consul.agent.service.register({
    name: serviceName,
    address: address,
    port,
  });
};

export const getMessageQueueAddress = async (): Promise<string> => {
  // TODO: Implement this
  return 'message-queue';
};
