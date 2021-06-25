import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Modal
} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import Image from 'react-native-scalable-image';


export const Popup = ({buttons, text, setModalVisible, modalVisible}) => {

  const ButtonsComponent = ({buttons, setModalVisible, modalVisible}) => {
    return buttons.map((button, i) => {
      return(
        <View key={i}>
          {
            button.primary ? (
              <PrimaryButton
                text={button.text}
                onPress={button.onClick}
              />
            ) : (
              <SecondaryButton
                text={button.text}
                onPress={button.onClick}
              />
            )
          }
          <View style={{marginVertical: 7}}></View>
        </View>
      )
    })
  }

  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000070'}}>
        <View style={{flexDirection: 'row', flex: 0}}>
          <View style={{flex: 1}}></View>
          <View style={{
              justifyContent: 'center',
              flex: 5,
              borderRadius: 20,
              paddingHorizontal: 25,
              paddingTop: 20,
              paddingBottom: 10,
              backgroundColor: GlobalColors.dcLightGrey
              }}>
            <Text style={{color: 'white', textAlign: 'center', marginBottom: 15, fontSize: 20}}>
            {text}
            </Text>

            <ButtonsComponent buttons={buttons} setModalVisible={setModalVisible} modalVisible={modalVisible}/>

          </View>
          <View style={{flex: 1}}></View>
        </View>
      </View>
    </Modal>
  )
}

export const PrimaryButton = ({text, onPress, isLoading, square = false}) => {

  let extraStyles = {}
  if (square) extraStyles.borderRadius = 0;

  return(
    <TouchableHighlight
      underlayColor={'#dba400'}
      onPress={onPress}
      style={[styles.button, extraStyles]}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading ? <View style={{flex: 1}}></View> : null}
        <Text style={[styles.text, {color: 'black', fontWeight: 'bold'}]}> {text} </Text>
        {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
      </View>
    </TouchableHighlight>
  )
}

export const PrimaryButtonWithIcon = ({text, onPress, iconType, iconName, square = false}) => {
  let extraStyles = {}
  if (square) extraStyles.borderRadius = 0;

  return(
      <TouchableHighlight
        underlayColor={'#dba400'}
        onPress={onPress}
        style={[styles.button, extraStyles]}>
        <View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center'}}>

          <Text style={[styles.text,
                { color: 'black', textAlign: 'center', fontWeight: 'bold', marginRight: 15}]
              }>
            {text}
          </Text>

          <View style={{marginVertical: -15}}>
            <Icon
              name={iconName}
              type={iconType}
            />
          </View>
        </View>

      </TouchableHighlight>
  );
}

export const SecondaryButtonWithIcon = ({text, onPress, iconType, iconName}) => {

  return(
      <TouchableHighlight
        onPress={onPress}
        style={styles.secondaryButtonbutton}>
        <View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center'}}>

          <Text
            style={[styles.text, { color: GlobalColors.dcYellow, fontWeight: 'bold', marginRight: 15}]}>
            {text}
          </Text>

          <View style={{marginVertical: -15}}>
            <Icon
              name={iconName}
              type={iconType}
            />
          </View>
        </View>

      </TouchableHighlight>
  );
}

export const SecondaryButton = ({text, onPress, isLoading}) => {
  return(
    <TouchableHighlight
      onPress={onPress}
      style={styles.secondaryButtonbutton}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading ? <View style={{flex: 1}}></View> : null}
          <Text style={[styles.text, {color: GlobalColors.dcYellow, fontWeight: 'bold'}]}> {text} </Text>
        {isLoading ? <ActivityIndicator style={{flex: 1, marginRight: 0}} color="black" size={25}/> : null}
      </View>
    </TouchableHighlight>
  )
}

export const UsersName = ({isStaff, isSuperUser, fName, sName, fontSize, style, defaultFont}) => {
  const defaultFontSize = 20;
  return (
    <View >
      {
        isStaff ?
        (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[{
                color: GlobalColors.dcYellow,
                fontSize: (fontSize ? fontSize : defaultFontSize),
                fontFamily : (defaultFont ? '' : 'BebasNeue Bold')
              }, style]}>
              {`${fName} ${sName}`}
            </Text>
          </View>
        ) : (
          <Text style={[{
              color: 'white',
              fontSize: (fontSize ? fontSize : defaultFontSize),
              fontFamily : 'BebasNeue Bold'
            }, style]}>
            {`${fName} ${sName}`}
          </Text>
        )
      }

    </View>
  );
}

/*
<View style={{ marginLeft: 10}}>
  <Image
    width={Dimensions.get('window').width*0.045}
    source={require('../assets/images/DC-icon.png')}/>
</View>

*/

export const LoadingView = ({text, useBackground}) => {
  return(
      <View style={{
          backgroundColor: (useBackground ? GlobalColors.dcGrey : '#00000000'),
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={{fontSize: 25, marginTop: 30,marginBottom: 20, textAlign: 'center', color: '#FFC300'}} >
          {text}
        </Text>
        <ActivityIndicator color={GlobalColors.dcYellow} size={80} />
      </View>
  )
}

export const SearchInput = ({placeholder, onPress, onChangeText, value}) => {
  return(

    <View style={styles.searchView}>
      <TextInput
          value={value}
          multiline={false}
          numberOfLines={1}
          onPress={() => onPress}
          onChangeText={value => onChangeText(value)}
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={'lightgrey'}
          keyboardAppearance={'dark'}
          color={'white'}
          fontSize={18}
          placeholderTextColor={'#afafaf'}
      />
      <Icon
        onPress={() => alert('icon pressed')}
        name='search'
        type='font-awesome-5'
        color={GlobalColors.dcYellow}
      />
    </View>

  );
}


const styles = StyleSheet.create({
  searchView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: GlobalColors.dcYellow,
    paddingHorizontal: 25,
    marginVertical : 15,
    marginHorizontal : 10,
  },
  inputView : {
    flex : 1,
    backgroundColor : '#494949',
    borderRadius : 15,
    marginBottom : 10,
    marginTop : 0,
    marginLeft : 10,
    paddingHorizontal : 15,
  },
  inputText:{
    flex: 1,
  },
  text: {
    color : 'white',
    fontSize : 20,
  },
  errorText: {
    color : 'white',
    fontSize : 16,
  },
  button : {

    backgroundColor: '#FFC300',
    alignItems : 'center',
    // marginVertical: 10,
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
  secondaryButtonbutton : {
    alignItems : 'center',
    paddingVertical: 10,
    borderColor: '#FFC300',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor : 'white'
  },
});
