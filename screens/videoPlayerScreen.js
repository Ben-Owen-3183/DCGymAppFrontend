import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  BackHandler,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import * as ScreenOrientation from 'expo-screen-orientation'
import { setStatusBarHidden } from 'expo-status-bar'
import { PrimaryButton, PrimaryButtonWithIcon } from '../shared/basicComponents'
import { WebView } from 'react-native-webview';

const VideoPlayerScreen = ({navigation, route, setShowHeader}) => {
  const [loading, setLoading] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showFullscreenButton, setShowFullscreenButton] = React.useState(true);

  async function toggleFullscreen(){
    if(!isFullscreen){
      setShowHeader(false);
      setIsFullscreen(true);
      hideNavigationBar();
      setStatusBarHidden(true, 'fade')
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)

      setShowFullscreenButton(true);
      setTimeout(() => setShowFullscreenButton(false), 2000);
    }
    else{
      setShowFullscreenButton(false);
      setShowHeader(true);
      setIsFullscreen(false);
      showNavigationBar();
      setStatusBarHidden(false, 'fade')
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }
  }

  React.useEffect(() => {
    const backAction = () => {
      showNavigationBar()
      setShowHeader(true);
      setStatusBarHidden(false, 'fade')
      setIsFullscreen(false);
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      navigation.goBack()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return(
    <View style={{flex: 1, backgroundColor: GlobalColors.dcGrey}}>
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => {
            if(isFullscreen && !showFullscreenButton){
              setTimeout(() => setShowFullscreenButton(true), 650);
              setTimeout(() => setShowFullscreenButton(false), 4900);
            }

            if(showFullscreenButton){
              setShowFullscreenButton(false);
            }
          }}>
          <WebView
            originWhitelist={['*']}
            useWebKit={false}
            scalesPageToFit={false}
            bounces={false}
            javaScriptEnabled
            automaticallyAdjustContentInsets={false}
            thirdPartyCookiesEnabledarrow_up={true}
            source={
              {
                html: `
                <!DOCTYPE html>
                <html>
                  <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body {
                    background-color: black
                    }
                    </style>
                  </head>
                  <body>
                  <iframe
                    src="https://player.vimeo.com/video/${route.params.id}"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                    style="position:absolute;top:0;left:0;width:100%;height:100%;"
                  </iframe>
                  </body>
                </html>
                `
              }
            }
          />
        </TouchableWithoutFeedback>
      </View>
      {
        (!isFullscreen || showFullscreenButton) && Platform.OS === 'android' ? (
          <View style={{
            position: 'absolute',
            top: 10,
            left: 10,
          }}>
            <PrimaryButton
              text={isFullscreen ? '     Exit Fullscreen     ' : '     Enter Fullscreen     '}
              onPress={() => toggleFullscreen()}
            />
          </View>
        ) : (null)
      }
    </View>
  )
}

export default VideoPlayerScreen;
