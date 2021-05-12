import {StyleSheet} from 'react-native';


export const GlobalColors = {
  dcYellow: '#FFC300',
  dcGrey: '#2D2D2D',
  dcLightGrey: '#494949',
}

export const globalHeaderStyles = StyleSheet.create({
  container : {
    height : '100%',
    backgroundColor : '#2D2D2D'
  },
  text : {
    color : '#FFC300',
  }
});

export const GlobalStyles = StyleSheet.create({
  container : {
    height : '100%',
    backgroundColor : '#d3d3d3'
  },
  text: {
    color : 'white',
    fontSize : 16,
  },
  primaryText : {
    color : GlobalColors.dcYellow,
    fontSize : 16,
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
