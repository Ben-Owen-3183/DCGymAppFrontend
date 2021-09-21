import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import { WebView } from 'react-native-webview';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import { PrimaryButton, PrimaryButtonWithIcon } from '../shared/basicComponents'
import * as ScreenOrientation from 'expo-screen-orientation'
import { setStatusBarHidden } from 'expo-status-bar'
// import {AuthContext} from '../routes/drawer';


const LiveStream = ({navigation, setShowHeader, route}) => {
  const [loading, setLoading] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [streamChatToggle, setStreamChatToggle]  = React.useState(true);
  const [showFullscreenButton, setShowFullscreenButton] = React.useState(false);
  const scrollRef = React.useRef();
  // const { signOut } = React.useContext(AuthContext);
  // signOutHook = signOut;

  async function toggleFullscreen(){
    if(!isFullscreen){
      setShowHeader(false);
      setIsFullscreen(true);
      hideNavigationBar();
      setStatusBarHidden(true, 'fade')
      setShowFullscreenButton(true);
      setTimeout(() => setShowFullscreenButton(false), 2000);
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else{
      setShowFullscreenButton(false);
      setShowHeader(true);
      setIsFullscreen(false);
      showNavigationBar();
      setStatusBarHidden(false, 'fade')
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  React.useEffect(() => {
    const backAction = () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      showNavigationBar()
      setShowHeader(true);
      setStatusBarHidden(false, 'fade')
      setIsFullscreen(false);
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
      {
        !isFullscreen ? (
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View style={{flex: 2}}>
              <PrimaryButton
                text={streamChatToggle ? 'Show Chat' : 'Show Stream'}
                square={true}
                onPress={() => {
                  setStreamChatToggle(!streamChatToggle)


                }}
              />
            </View>
            {streamChatToggle && Platform.OS === 'android' ? (<View style={{marginHorizontal: 3}}></View>) : (null)}
            {
              streamChatToggle && Platform.OS === 'android' ? (
                <View style={{flex: 1}}>

                  <PrimaryButton
                    square={true}
                    text={'Fullscreen'}
                    onPress={() => toggleFullscreen()}
                  />
                </View>
              ) : (null)
            }

          </View>
        ) : (
          null
        )
      }

        <TouchableWithoutFeedback
          style={{
            flex: 1,
          }}
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
            style={{
              width: '200%',
              transform: [
                { translateX: (!streamChatToggle ? -Dimensions.get('window').width : 0) }
              ]
            }}
            originWhitelist={['*']}
            useWebKit={true}
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
                    style="position: absolute; top:0;left:50%;"
                    src="${route.params.chat_url}"
                    height="100%"
                    width="50%"
                    frameborder="0">
                  </iframe>
                  <iframe
                    src="${route.params.stream_url}"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen
                    style="position:absolute;top:0;left:0%;width:50%;height:100%;"
                  </iframe>
                  </body>
                </html>

                `
              }
            }
          />
        </TouchableWithoutFeedback>
      {
        isFullscreen && showFullscreenButton? (
          <View style={{
            position: 'absolute',
            top: 10,
            left: 10,
          }}>
            <PrimaryButton
              text={'     Exit Fullscreen     '}
              onPress={() => toggleFullscreen()}
            />
          </View>
        ) : (null)
      }
    </View>
  )
}

/*
const LiveStream = ({navigation, setShowHeader, route}) => {
  const [loading, setLoading] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [streamChatToggle, setStreamChatToggle]  = React.useState(true);
  const [showFullscreenButton, setShowFullscreenButton] = React.useState(false);
  // const { signOut } = React.useContext(AuthContext);
  // signOutHook = signOut;

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
    <View style={{margin: 0, padding: 0, flex: 1, backgroundColor: GlobalColors.dcGrey}}>
      {
        !isFullscreen ? (
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View style={{flex: 2}}>
              <PrimaryButton

                text={streamChatToggle ? 'Show Chat' : 'Show Stream'}
                square={true}
                onPress={() => setStreamChatToggle(!streamChatToggle)}
              />
            </View>
            {streamChatToggle ? (<View style={{marginHorizontal: 3}}></View>) : (null)}
            {
              streamChatToggle ? (
                <View style={{flex: 1}}>

                  <PrimaryButton
                    square={true}
                    text={'Fullscreen'}
                    onPress={() => toggleFullscreen()}
                  />
                </View>
              ) : (null)
            }

          </View>
        ) : (
          null
        )
      }

      <View
        style={{
          flex: streamChatToggle ? 1 : 0
        }}>
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
            style={{
              backgroundColor: GlobalColors.dcGrey,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            originWhitelist={['*']}
            useWebKit={true}
            scalesPageToFit={false}
            bounces={false}
            javaScriptEnabled
            automaticallyAdjustContentInsets={false}
            thirdPartyCookiesEnabledarrow_up={true}
            source={
              {
                html: `
                <iframe
                  src="${route.params.stream_url}"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  style="position:absolute;top:0;left:0;width:100%;height:100%;"
                </iframe>
                `
              }
            }
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={{flex: !streamChatToggle ? 1 : 0}}>
        <WebView
          style={{
            backgroundColor: GlobalColors.dcGrey,
          }}
          thirdPartyCookiesEnabledarrow_up={true}
          sharedCookiesEnabled
          originWhitelist={['*']}
          useWebKit={true}
          scalesPageToFit={false}
          bounces={false}
          javaScriptEnabled
          automaticallyAdjustContentInsets={false}
          source={{
            html: `
              <iframe
                style="position: absolute; top:0;left:0;width:100%;margin: 0, padding: 0"
                src="${route.params.chat_url}"
                width="100%"
                height="100%"
                frameborder="0">
              </iframe>
            `
          }}
        />
      </View>
      {
        isFullscreen && showFullscreenButton? (
          <View style={{
            position: 'absolute',
            top: 10,
            left: 10,
          }}>
            <PrimaryButton
              text={'     Exit Fullscreen     '}
              onPress={() => toggleFullscreen()}
            />
          </View>
        ) : (null)
      }
    </View>
  )

}
*/

export default LiveStream;

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
/*
source={{uri: 'https://player.vimeo.com/video/385061587'}}

<Video
  source={{ uri: 'https://player.vimeo.com/play/2720287201?s=575839045_1626454854_2e3667304fd95048291c6eccf6a72513&sid=79225dc6443ebcfe6a8cd3b5e1ddfc8dd02abcb51626444054&oauth2_token_id=&download=1' }}
  style={styles.backgroundVideo}
  resizeMode={'contain'}
  controls={true}
/>

<iframe src="https://player.vimeo.com/video/385061587" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://vimeo.com/385061587">A Handpainted Anamorphic Glass Sculpture With Four Hidden Images</a> from <a href="https://vimeo.com/itscolossal">Colossal</a> on <a href="https://vimeo.com">Vimeo</a>.</p>

<iframe src="https://player.vimeo.com/video/575839045" width="640" height="564" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/385061587?color=ff9933" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

https://vimeo.com/user145100056/download/575839045/0b3b9aa23b

https://vimeo.com/575839045

<iframe src="https://player.vimeo.com/video/533559247?color=ccb676&portrait=0" width="640" height="384" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<p><a href="https://vimeo.com/533559247">PANJE | #DrowningPrevention</a> from <a href="https://vimeo.com/stevewon">Steve Won</a> on <a href="https://vimeo.com">Vimeo</a>.</p>



<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/575854027" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>

<iframe title="vimeo-player" src="https://player.vimeo.com/video/575854027" width="640" height="360" frameborder="0" allowfullscreen></iframe>
*/
