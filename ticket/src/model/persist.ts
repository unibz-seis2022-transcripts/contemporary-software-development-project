import storage from 'node-persist';

export const initStorage = async (storagePath: string): Promise<void> => {
  await storage.init({ dir: storagePath, logging: true });
};

export const getItem = async <T>(itemName: string): Promise<T> => {
  const persistedItem: T = await storage.getItem(itemName);
  return persistedItem;
};

export const setItem = <T>(itemName: string, item: T): void => {
  storage.setItem(itemName, item);
};
