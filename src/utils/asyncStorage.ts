import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeAsyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error("Unable to store key-value pair in async storage:", e);
    }
  };
  
export const getAsyncData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {
      console.log("Unable to retrieve async storage key:", e);
    }
  };
  