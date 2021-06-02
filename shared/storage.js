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


// CHAT

export async function storeChats(chats) {
    try {
      if(!chats && chats.length === 0)
        return;

      for(let i = 0; i < chats.length; i++){
        let messages = chats[i].messages;
        let newMessages = [];
        for(let j = 0; j < 30; j++){
          newMessages[j] = messages[j];
        }
        chats[i].messages = newMessage;
      }

        await EncryptedStorage.setItem(
            "chats",
            JSON.stringify(chats)
        );
        // Congrats! You've just stored your first value!
    } catch (error) {
        // There was an error on the native side
    }
}

export async function retrieveChats() {
    try {
        const chats = await EncryptedStorage.getItem("chats");
        if (chats !== undefined) {
          return JSON.parse(chats);
        }
    } catch (error) {
        // There was an error on the native side
    }
    return ''
}

export async function removeChats() {
    try {
        await EncryptedStorage.removeItem("chats");
        // Congrats! You've just removed your first value!
    } catch (error) {
        // There was an error on the native side
    }
}
