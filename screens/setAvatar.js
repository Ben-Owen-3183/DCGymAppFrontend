import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  Platform,
} from 'react-native';
import CustomAvatar from '../shared/customAvatar';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../routes/drawer';
import {storeUserData, retrieveUserData} from '../shared/storage';
import Settings from '../shared/settings';

const backgroundImagePath = '../assets/images/timetable-background.png';
let signOutHook;

const SetAvatar = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const { updateUserData } = React.useContext(AuthContext);
  const [userData, setUserData] = React.useState('')
  const [errors, setErrors] = React.useState('')

  function createFormData(image){
    let imageData = {
      name: 'image.jpg',
      type: image.mime,
      uri: Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path,
    };

    var data = new FormData();
    data.append('image', imageData);
    return data;
  };


  // START SUBMIT
  function submit(image){
    setErrors(null);

    const onSuccess = (response) => {
      if (response['errors']){
        console.log(response['errors']);
        setErrors(response['errors']);
      }
      else {
        userData.avatarURL = response['url'];
        const newUserData = Object.assign({}, userData);
        setUserData(newUserData);
        storeUserData(newUserData);
        updateUserData(newUserData);

      }
    };

    const onFailure = (response) => {
      console.log('failure');
      setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
    };

    fetch(Settings.siteUrl + '/user/avatar/', {
        method: "POST",
        enctype: "multipart/form-data",
        headers: {
          "Authorization": "Token " + userData.token
        },
        body: createFormData(image)
      })
      .then((response) => {
        if(response.status == 401 || response.status == 403){
        	signOutHook();
        	return;
        }

        return response.json()
      })
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})
  }
  // END SUBMIT

  React.useEffect(() => {
    const loadUserData = async () => {
      let response;

      try {
        response = await retrieveUserData();
      } catch (e) {
      }
      setUserData(response);
    };

    loadUserData();
  }, []);

  function selectImage(){
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      compressImageMaxHeight: 640,
      compressImageMaxWidth: 640,
      width: 1000,
      height: 1000,
      cropping: true
    }).then(image => {
      submit(image);
    }).
    catch(e => {

    });
  }

  function takePhoto(){
    ImagePicker.openCamera({
      useFrontCamera: true,
      compressImageQuality: 0.8,
      compressImageMaxHeight: 640,
      compressImageMaxWidth: 640,
      width: 1000,
      height: 1000,
      cropping: true,
    }).then(image => {
      submit(image);
    }).
    catch(e => {

    });
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>

        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>
          <View style={{alignItems: 'center' }}>
            <Text style={styles.titleText}>
              Choose your avatar
            </Text>

            <View style={{marginVertical: 10}}></View>
            <CustomAvatar
              avatarURL={userData.avatarURL}
              style={{marginBottom: 35}}
              size={240}
              name={`${userData.first_name} ${userData.last_name}`}
              />
            <View style={{marginVertical: 7}}></View>
          </View>

          <TouchableHighlight
            underlayColor={'#dba400'}
            onPress={() => takePhoto()}
            style={styles.button}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Take Photo </Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={'#dba400'}
            onPress={() => selectImage()}
            style={styles.button}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Upload </Text>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default SetAvatar;


const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    // backgroundColor : '#2D2D2D',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color : 'white',
    fontSize : 20,
    textAlign: 'center'
  },
  inputText: {
    paddingVertical: 15,
  },
  inputContainer: {
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  secondaryButton: {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
  },
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
  },
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
  titleText : {
      color : '#FFC300',
      margin : 'auto',
      marginTop : 20,
      marginBottom : 20,
      fontSize : 40,
      fontWeight: Platform.OS === 'android' ? null: 'bold',
      fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
    },
});
