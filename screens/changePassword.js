import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  ImageBackground
} from 'react-native';
import Settings from '../shared/settings'
import {retrieveUserData} from '../shared/storage';
import {AuthContext} from '../routes/drawer';

const backgroundImagePath = '../assets/images/timetable-background.png';
let signOutHook;

const Errors = ({ errors }) => {
  return(
    <View style={{backgroundColor: '#515151', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6}}>
      <Text style={[styles.errorText, {margin: 5}]}>Please address the following issue{errors.length > 1 ? 's' : null}:</Text>
      {
        errors.map((error, i) => {
          return(
            <View style={{margin: 5, flexDirection: 'row'}} key={i}>
              <View style={{marginHorizontal: 7, flex: 0}}>
                <Text style={[styles.errorText, {fontWeight: 'bold'}]}>-</Text>
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

const ChangePassword = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [newPasswordConf, setNewPasswordConf] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [userData, setUserData] = React.useState('');

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


  // START SUBMIT
  function submit(){
    if(isLoading)
      return;

    setErrors(null);

    const onSuccess = (response) => {
      setIsLoading(false);
      if (response['errors']){
        setErrors(response['errors'])
      }
      else{
        navigation.reset({index: 0, routes: [{ name: 'ChangePasswordSuccess' }],})
      }
    };

    const onFailure = (response) => {
      console.log('failure');
      setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
    };

    setIsLoading(true);
    fetch(Settings.siteUrl + '/user/password/change/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": "Token " + userData.token
        },
        body: JSON.stringify({
          'currentPassword': currentPassword,
          'newPassword': newPassword,
          'newPasswordConf': newPasswordConf,
        })
      })
      .then((response) => {
        if(response.status == 401 || response.status == 403){
        	signOutHook();
        	return;
        }
        return response.json();
      })
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})
  }
  // END SUBMIT


  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <View style={styles.mainContainer}>

        <View style={{flex: 1}}></View>

        <View style={{flex: 5}}>

          <View >
            <Text style={styles.titleText}>
              Set New Password
            </Text>
          </View>

          <View style={{marginVertical: 10}}></View>

          <Text style={styles.text}>
            Enter you current password and confirm your new one. The password change will take place immediately and will be required on the next login attempt.
          </Text>

          <View style={{marginVertical: 10}}></View>

          <TextInput
            value={currentPassword}
            onChangeText={text => setCurrentPassword(text)}
            style={styles.inputText}
            placeholder="Current Password"
            autoCompleteType={'password'}
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />
          <View style={styles.line}></View>
          <View style={{marginVertical: 10}}></View>

          <TextInput
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            style={styles.inputText}
            placeholder="New Password"
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />

          <View style={styles.line}></View>
          <View style={{marginVertical: 10}}></View>

          <TextInput
            value={newPasswordConf}
            onChangeText={text => setNewPasswordConf(text)}
            style={styles.inputText}
            placeholder="Confirm New Password"
            secureTextEntry={true}
            numberOfLines={1}
            placeholderTextColor={'lightgrey'}
            fontSize={18}
            color={'white'}
            keyboardAppearance={'dark'}
          />

          <View style={styles.line}></View>

          <View style={{marginVertical: 20}}>
            {errors ? <Errors errors={errors}/> : null}
          </View>

          <TouchableHighlight
            onPress={() => submit()}
            underlayColor={'#dba400'}
            style={styles.button}>
            <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}>
            Submit
            </Text>
          </TouchableHighlight>
          <View style={{marginVertical: 40}}></View>
        </View>

        <View style={{flex: 1}}></View>
      </View>
    </ImageBackground>
  );
}
export default ChangePassword;


const styles = StyleSheet.create({
  errorText: {
    color : 'white',
    fontSize : 16,
  },
  line: {
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
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
  },
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
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
    fontFamily : 'BebasNeue Bold'
  },
});
