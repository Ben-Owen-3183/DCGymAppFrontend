import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';
import {PrimaryButton} from '../shared/basicComponents'
import WebView from 'react-native-webview'

const JAVASCRIPT = 'gcaptcha = document.querySelector(\'.g-recaptcha\');'
  + 'gcaptcha.style.marginLeft = 0;'

// g-recaptcha


const GymMembership = () => {

  const [reload, setReload] = React.useState(null);
  const [failedToLoad, setFailedToLoad] = React.useState(false);

  return (
    <View style={{width: '100%', height: '100%'}}>
      {
        failedToLoad ?
        (
          <View style={{backgroundColor: 'white', paddingHorizontal: 130, flex: 1, justifyContent: 'center'}}>
            <Text style={{marginVertical: 20, fontSize: 16,  marginHorizontal: 10, textAlign: 'center'}}>
              The external page failed to load. Make sure you have an internet connection.
            </Text>

            <PrimaryButton onPress={() => {
              reload.current ? reload.current.reload() : null;
              setFailedToLoad(false);
            }}
            text={'Reload'}/>
          </View>
        ) : (
          <GymSignUp setReload={setReload} setFailedToLoad={setFailedToLoad}/>
        )
      }
    </View>
  );
}

const GymSignUp = ({setReload, setFailedToLoad}) => {

  const webViewRef = React.useRef(null);
  return (
    <WebView
      ref={webViewRef}
      injectedJavaScript={JAVASCRIPT}
      onError={() => {
        setReload(webViewRef);
        setFailedToLoad(true);
      }}
      source={{ uri: 'https://davidcorfieldfitness.clubm.mobi/Member/Joining.mvc' }}/>
  );
}

export default GymMembership;
