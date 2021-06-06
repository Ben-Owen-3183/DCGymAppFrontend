import EncryptedStorage from 'react-native-encrypted-storage';

const Storage = {
  set: async (key, data) =>{
    try {
        await EncryptedStorage.setItem(
            key,
            JSON.stringify(data)
        );
    } catch (error) {
      console.log(`Storage.set: ${error}`);
    }
  },
  get: async (key) => {
    try {
        const data = await EncryptedStorage.getItem(key);
        if (data !== undefined) {
          return JSON.parse(data);
        }
    } catch (error) {
      console.log(`Storage.get: ${error}`)
    }
    return undefined;
  },
  remove: async (key) => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.log(`Storage.delete: ${error}`)
    }
  }
}

export default Storage;

export async function storeUserData(user_data) {
  try {
      await EncryptedStorage.setItem(
          "user_data",
          JSON.stringify(user_data)
      );
  } catch (error) {
  }
}

export async function retrieveUserData() {
  try {
      const userData = await EncryptedStorage.getItem("user_data");
      if (userData !== undefined) {
        return JSON.parse(userData);
      }
  } catch (error) {
  }
  return ''
}

export async function removeUserData() {
  try {
      await EncryptedStorage.removeItem("user_data");
  } catch (error) {
  }
}

// CHAT
export async function storeChats(chats) {
  try {
    if(!chats || chats.length === 0)
      return;

    for(let i = 0; i < chats.length; i++){
      let messages = chats[i].messages;
      let newMessages = [];
      for(let j = 0; j < 30; j++){
        if(!messages[j])
          break;
        newMessages[j] = messages[j];
      }
      chats[i].messages = newMessages;
    }
    await EncryptedStorage.setItem(
        "chats",
        JSON.stringify(chats)
    );
  } catch (error) {
    console.log(`Error Storing Chats: ${error}`)
  }
}

export async function retrieveChats() {
  try {
    const chats = await EncryptedStorage.getItem("chats");
    const parsedChats = JSON.parse(chats);
    if (parsedChats) {
      return parsedChats;
    }
  } catch (error) {
    console.log(`Error Retrieve Chat ${error}`);
  }
  return []
}

export async function removeChats() {
  try {
      await EncryptedStorage.removeItem("chats");
  } catch (error) {
  }
}
