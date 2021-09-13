import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
} from 'react-native';
import Navigator from './routes/drawer';
import {GlobalColors} from './styles/dcstyles';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import * as ScreenOrientation from 'expo-screen-orientation'

const App: () => Node = () => {
  changeNavigationBarColor(GlobalColors.dcGrey, true);
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        backgroundColor={GlobalColors.dcLightGrey}/>
      <Navigator/>
    </SafeAreaView>
  );
};

export default App;
