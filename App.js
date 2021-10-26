import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Navigator from './routes/drawer';
import {GlobalColors} from './styles/dcstyles';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import * as ScreenOrientation from 'expo-screen-orientation'

const App: () => Node = () => {
  changeNavigationBarColor(GlobalColors.dcGrey, true);
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

  return (
    <KeyboardAvoidingView 
      enabled
      behavior="padding"
      style={{flex: 1, backgroundColor: GlobalColors.dcLightGrey}}>
      <StatusBar backgroundColor={GlobalColors.dcLightGrey}/>
      <SafeAreaView style={{ flex: 1 }}>
        <Navigator/>
      </SafeAreaView>
    </KeyboardAvoidingView>
    
  );
};

export default App;
