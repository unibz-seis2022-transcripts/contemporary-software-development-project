import Consul from 'consul';
import promiseRetry from 'promise-retry';

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
  let address: string;

  await promiseRetry(
    async function (retry, attemptNumber) {
      console.log(
        `Trying to fetch message queue address from registry, attempt ${attemptNumber}`,
      );

      try {
        const services = await consul.agent.services();
        const mqService = Object.values(services).find(
          (service) => service.Service === 'rabbitmq',
        );

        if (!mqService) {
          throw new Error('MQ address could not be obtained from registry');
        }

        address = mqService.Address;
      } catch (error) {
        retry(error);
      }
    },
    { retries: 5 },
  );

  return address;
};
