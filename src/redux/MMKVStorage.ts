import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

/*
//Encrypted storage
export const storage = new MMKV({
  id: `user-${userId}-storage`, //required: if when either path/encryptionKey exist
  path: `${USER_DIRECTORY}/storage`, //optional: changing storage path
  encryptionKey: 'hunter2' //optional: storing all values encrypted
})
*/

//TO BE USED IN REDUX PERSIST
export const reduxPersistStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

//HELPER FUNCTIONS TO BE USED THROUGHOUT APP
export const StorageMMKV = {
  setUserPreferences: (key, value) => {
    try {
      storage.set(`${key}`, `${value}`);
    } catch (error) {
      console.error('Error setting user preferences:', error);
    }
  },

  getUserPreferences: key => {
    try {
      return storage.getString(key);
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null; // Or handle the error according to your application's logic
    }
  },

  removeItem: key => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },

  clearAll: () => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
