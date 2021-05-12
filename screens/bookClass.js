import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import {GlobalColors, GlobalStyles} from '../styles/dcstyles';
import {PrimaryButton} from '../shared/basicComponents'
import WebView from 'react-native-webview'
import { Icon } from 'react-native-elements';

const BookClass = () => {
  const [hide, setHide] = React.useState(false);
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
          <BookingSite setReload={setReload} setFailedToLoad={setFailedToLoad}/>
        )
      }

      {
        hide === false ?
        (
          <View style={{backgroundColor: GlobalColors.dcLightGrey, paddingHorizontal: 10, padding: 30}}>
            <Text style={GlobalStyles.primaryText}>
              Please note that you do not need to book if you are watching live. This is only required for physical visits to the gym. Thank you.
            </Text>
            <View>
              <View style={{alignItems: 'center'}}>
                <TouchableHighlight
                  underlayColor={'#dba400'}
                  onPress={() => setHide(true)}
                  style={{
                    position: 'absolute',
                    backgroundColor: GlobalColors.dcYellow,
                    borderRadius: 200,
                    width: 45,
                    height: 45,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: 45,
                  }}>
                  <Icon
                    size={30}
                    name='angle-double-down'
                    type='font-awesome-5'
                    color={GlobalColors.dcGrey}
                  />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        ) : (
          null
        )
      }
    </View>
  );
}

const BookingSite = ({setReload, setFailedToLoad}) => {
  const webViewRef = React.useRef(null);
  return (
    <WebView
      ref={webViewRef}
      onError={() => {
        setReload(webViewRef);
        setFailedToLoad(true);
      }}
      source={{ uri: 'https://davidcorfieldfitness.clubm.mobi/Portal/Booking/Forthcoming' }}/>
  );
}
export default BookClass;
