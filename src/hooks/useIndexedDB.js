import { useState, useEffect } from 'react';
import localforage from 'localforage';

export const useIndexedDB = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [isReady, setIsReady] = useState(false);

  // 1. Asynchronously fetch the data profile from IndexedDB storage block
  useEffect(() => {
    const initStorage = async () => {
      try {
        const saved = await localforage.getItem(key);
        if (saved !== null) {
          setValue(saved);
        }
      } catch (error) {
        console.error(`Error reading IndexedDB key "${key}":`, error);
      } finally {
        setIsReady(true);
      }
    };
    initStorage();
  }, [key]);

  // 2. Persist state runtime value directly to IndexedDB
  const updateValue = async (newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      await localforage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error writing IndexedDB key "${key}":`, error);
    }
  };

  return [value, updateValue, isReady];
};
