import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  Platform,
  ScrollView
} from 'react-native';
import Settings from '../shared/settings'
import {retrieveUserData} from '../shared/storage';

const backgroundImagePath = '../assets/images/timetable-background.png';

const Errors = ({ errors }) => {
  console.log("errors"  + errors);
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

const ForgottenPassword = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [finished, setFinished] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // START SUBMIT
  function submit(){
    setErrors(null);

    const onSuccess = (response) => {
      setIsLoading(false);
      if (response['errors']){
        setErrors(response['errors'])
      }
      else{
        setFinished(true);
      }
    };

    const onFailure = (response) => {
      setIsLoading(false);
      console.log('failure');
      setErrors(['Server cannot be reached. Make sure you are connected to the internet']);
    };

    setIsLoading(true);

    fetch(Settings.siteUrl + '/user/password/reset/', {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({email: email})
      })
      .then(response => response.json())
      .then(response => {onSuccess(response)})
      .catch(response => {onFailure(response)})
  }
  // END SUBMIT

  if(finished){
    return(
      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View style={{flex: 1}}></View>
          <View style={{flex: 5, marginTop: 60}}>
            <View>
              <Text style={styles.titleText}>Email Sent</Text>
              <Text style={styles.text}>
                An email has been sent to your inbox. Don't forget to check your junk folder if you don't see it.
              </Text>
            </View>

            <View style={{marginVertical: 20}}></View>

            <TouchableHighlight
              onPress={() => {
                setFinished(true);
                navigation.reset({index: 0, routes: [{ name: 'Login' }],})
              }}
              style={styles.button}
              underlayColor={'#dba400'}>
              <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}>
                Continue
              </Text>
            </TouchableHighlight>
          </View>

          <View style={{flex: 1}}></View>
        </ScrollView>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.mainContainer}>

        <View style={{flex: 1}}></View>

        <View style={{flex: 5, marginTop: 60}}>

          <View>
            <Text style={styles.titleText}>Enter Email</Text>
            <Text style={styles.text}>
              Enter your
              <Text style={[styles.text, {color: "#FFC300"}]}> app account email </Text>
              that you wish to reset the password for.
              {'\n'}{'\n'}
              On pressing
              <Text style={[styles.text, {color: "#FFC300"}]}> Reset Password </Text>
              an email will be sent to
              <Text style={[styles.text, {color: "#FFC300"}]}> confirm </Text>
              this action.
            </Text>
          </View>

          <View style={{marginVertical: 20}}></View>

          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.inputText}
            placeholder="Enter email"
            autoCompleteType={'email'}
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
            style={styles.button}
            underlayColor={'#dba400'}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              {isLoading ? <View style={{flex: 1}}></View> : null}
              <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> Reset Password </Text>
              {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
            </View>
          </TouchableHighlight>
        </View>

        <View style={{flex: 1}}></View>
      </ScrollView>
    </ImageBackground>
  );
}
export default ForgottenPassword;


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
    fontWeight: Platform.OS === 'android' ? null: 'bold',
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
  },
});
