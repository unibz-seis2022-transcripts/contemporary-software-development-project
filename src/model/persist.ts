import storage from 'node-persist';

export const initStorage = async <T>(
  storagePath: string,
  itemName: string,
): Promise<T> => {
  await storage.init({ dir: storagePath, logging: true });
  const persistedItem: T = await storage.getItem(itemName);
  return persistedItem;
};

export const setItem = <T>(itemName: string, item: T): void => {
  storage.setItem(itemName, item);
};
