import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import CustomAvatar from '../shared/customAvatar';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../routes/drawer';
import {storeUserData, retrieveUserData} from '../shared/storage';
import Settings from '../shared/settings';

const backgroundImagePath = '../assets/images/timetable-background.png';

function createFormData(image){
  let imageData = {
    name: '',
    type: image.mime,
    uri: Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path,
  };

  var data = new FormData();
  console.log("form append");
  data.append('image', imageData);
  console.log("form end");
  return data;
};

function submit(image, userData, setErrors){
  setErrors(null);

  const onSuccess = (response) => {
    console.log(response);
  };

  const onFailure = (response) => {
    console.log('failure');
      setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
  };

  fetch('http://' + Settings.siteUrl + '/user/avatar/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token
      },
      body: createFormData(image)
    })
    .then(response => response.json())
    .then(response => {onSuccess(response)})
    .catch(response => {onFailure(response)})
}


const SetAvatar = ({ navigation }) => {
  const { updateUserData } = React.useContext(AuthContext);
  const [userData, setUserData] = React.useState('')
  const [errors, setErrors] = React.useState('')

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
      includeBase64: true,
      width: 400,
      height: 400,
      cropping: true
    }).then(image => {
      submit(image, userData, setErrors);
    }).
    catch(e => {

    });
  }

  function takePhoto(){
    ImagePicker.openCamera({
      includeBase64: true,
      useFrontCamera: true,
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      submit(image, userData, setErrors);
    }).
    catch(e => {

    });
  }

  // Updates avatar CLIENT side
  function saveUserData(imageData){
    userData.avatarData = imageData;
    const newUserData = Object.assign({}, userData);
    setUserData(newUserData);
    storeUserData(newUserData);
    updateUserData(newUserData);
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>

        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>
          <View style={{alignItems: 'center' }}>
            <CustomAvatar avatarData={userData.avatarData} style={{marginBottom: 35}} size={240}/>
            <View style={{marginVertical: 7}}></View>
            <Text style={styles.text}>
              Choose your avatar
            </Text>
          </View>

          <View style={{marginVertical: 20}}></View>
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
});
