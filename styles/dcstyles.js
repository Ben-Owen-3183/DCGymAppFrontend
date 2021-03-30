import {React, StyleSheet} from 'react-native';

export const globalHeaderStyles = StyleSheet.create({
  container : {
    height : '100%',
    backgroundColor : '#2D2D2D'
  },
  text : {
    color : '#FFC300',
  }
});

export const globalStyles = StyleSheet.create({
  container : {
    height : '100%',
    backgroundColor : '#d3d3d3'
  },
  text : {
    color : '#000000',
  }
});

export const DefaultNavigationOptions = {
  defaultNavigationOptions : {
    headerTintColor  : '#FFC300',
    headerStyle : {
      backgroundColor : '#2D2D2D',
      shadowColor : '#2D2D2D',
    },
    headerTitleStyle : {
      color : '#FFC300'
    },
  }
}
