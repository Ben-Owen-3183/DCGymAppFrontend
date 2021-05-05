import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserData(user_data) {
    try {
        await EncryptedStorage.setItem(
            "user_data",
            JSON.stringify(user_data)
        );
        // Congrats! You've just stored your first value!
    } catch (error) {
        // There was an error on the native side
    }
}

export async function retrieveUserData() {
    try {
        const userData = await EncryptedStorage.getItem("user_data");
        if (userData !== undefined) {
          return JSON.parse(userData);
        }
    } catch (error) {
        // There was an error on the native side
    }
    return ''
}

export async function removeUserData() {
    try {
        await EncryptedStorage.removeItem("user_data");
        // Congrats! You've just removed your first value!
    } catch (error) {
        // There was an error on the native side
    }
}

/*
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
*/
