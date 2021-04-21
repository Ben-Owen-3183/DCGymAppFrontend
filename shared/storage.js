import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeToken(token) {
  try {
      await EncryptedStorage.setItem("token", token);
  } catch (error) {
  }
}

export async function getToken() {
    try {
        const token = await EncryptedStorage.getItem("token");
        if (token !== undefined) {
          return token;
        }
    } catch (error) {
    }
    return '';
}

export async function deleteToken() {
    try {
        await EncryptedStorage.removeItem("token");
        // Congrats! You've just removed your first value!
    } catch (error) {
        // There was an error on the native side
    }
}
