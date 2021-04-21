import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import Image from 'react-native-scalable-image';
import {storeToken} from '../shared/storage';
import {AuthContext} from '../routes/drawer';

const backgroundImagePath = '../assets/images/timetable-background.png';

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

const Login = ({navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const { setToken } = React.useContext(AuthContext);

  function onSubmit(username, password, setIsLoading, setErrors){
    setErrors(null);
    let payload = {
      'username': username,//username.value,
      'password': password//password.value
    }

    console.log(payload)
    const onSuccess = (response) => {
      setIsLoading(false);
      // user logged in :)
      if(response['token']){
        storeToken(response['token']);
        setToken(response['token']);
      }
      // user did not login :(
      else{
        let newErrors = [];
        if(response['non_field_errors'])
          newErrors.push('The email or password provided is incorrect. Please check they are correct and try again')
        if(response['username'])
          newErrors.push('The email field cannot be blank. Enter the correct email to sign in')
        if(response['password'])
          newErrors.push('The password field cannot be blank. Enter the correct password to sign in')

        if(newErrors.length > 0)
          setErrors(newErrors)
      }

    };

    const onFailure = (response) => {
        setIsLoading(false);
        setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
        console.log(response);
    };

    setIsLoading(true);

    fetch('http://192.168.43.167:8000/auth/login/', {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})

  }

  /*
  const handleUsernameChange = event => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }
  */


  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <ScrollView style={{width: '100%'}}>
        <View style={[styles.mainContainer, {marginBottom: 100}]}>
          <View style={{flex: 1}}></View>

          <View style={{flex: 5}}>
            <ActivityIndicator size="large" />
            <View style={{alignItems: 'center'}}>
              <Image
                width={Dimensions.get('window').width*0.9}
                source={require('../assets/images/dclogo.png')}/>
              <Text style={styles.text}></Text>
            </View>

            <TextInput
              value={username}
              onChangeText={text => setUsername(text)}
              style={styles.inputText}
              placeholder="Email"
              numberOfLines={1}
              keyboardType={'email-address'}
              placeholderTextColor={'lightgrey'}
              fontSize={18}
              color={'white'}
              keyboardAppearance={'dark'}
            />

            <View style={styles.inputContainer}></View>
            <View style={{marginVertical: 10}}></View>

            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.inputText}
              keyboardAppearance={'dark'}
              blurOnSubmit={true}
              numberOfLines={1}
              placeholder="Password"
              textContentType={'password'}
              secureTextEntry={true}
              placeholderTextColor={'lightgrey'}
              fontSize={18}
              color={'white'}
            />
            <View style={styles.inputContainer}></View>

            <View style={{marginVertical: 20}}>
              {errors ? <Errors errors={errors}/> : null}
            </View>

            <TouchableHighlight
              onPress={isLoading ? null : () => onSubmit(username, password, setIsLoading, setErrors)}
              underlayColor={'#dba400'}
              style={[styles.button, {backgroundColor: '#FFC300'}]}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? <View style={{flex: 1}}></View> : null}
                <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Login </Text>
                {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => navigation.navigate('SignupStep1')}
              style={[styles.button]}>
              <Text style={[styles.text, {color: '#FFC300', fontWeight: 'bold'}]}> Sign up </Text>
            </TouchableHighlight>
          </View>

          <View style={{flex: 1}}></View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
export default Login;

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
  },
  errorText: {
    color : 'white',
    fontSize : 16,
  },
  inputText: {
    paddingVertical: 15,
  },
  inputContainer: {
    //paddingVertical: 0,
    //backgroundColor: '#494949',
    //borderRadius: 40,
    //backgroundColor: '#ff9900',
    marginHorizontal: 5,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  button : {
    alignItems : 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
  backgroundImage : {
      flex: 1,
      resizeMode: "cover",
      alignItems : 'center',
    },
});
