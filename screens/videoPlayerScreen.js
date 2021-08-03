import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
// import { Video, VideoFullscreenUpdateEvent } from 'expo-av';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
// import VideoPlayer from 'expo-video-player'
import VideoPlayer from 'react-native-video-controls';
import * as ScreenOrientation from 'expo-screen-orientation'
import { setStatusBarHidden } from 'expo-status-bar'
// import Video from 'react-native-video';

const VideoPlayerScreen = ({navigation, route, setShowHeader}) => {
  const [inFullscreen, setInFullsreen] = React.useState(false)
  const refVideo = React.useRef(null)

  React.useEffect(() => {
    const backAction = () => {
      showNavigationBar()
      setShowHeader(true);
      setStatusBarHidden(false, 'fade')
      setInFullsreen(!inFullscreen)
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



  return (
    <VideoPlayer
      disableBack={true}
      source={{uri: route.params.file}}
      onEnterFullscreen={async () => {
        hideNavigationBar()
        setShowHeader(false);
        setStatusBarHidden(true, 'fade')
        setInFullsreen(!inFullscreen)
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      }}
      onExitFullscreen={async () => {
        showNavigationBar()
        setShowHeader(true);
        setStatusBarHidden(false, 'fade')
        setInFullsreen(!inFullscreen)
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      }}
      style={{backgroundColor: GlobalColors.dcGrey}}
      seekColor={GlobalColors.dcYellow}
      poster={route.params.thumbnail}
    />
  )

  // console.log(refVideo)

    /*
  return (
    <View style={{flex: 1, flexDirection: 'column', backgroundColor: GlobalColors.dcGrey}}>
      <VideoPlayer
        onReadyForDisplay={response => console.log(response)}
        videoProps={{
          shouldPlay: true,
          resizeMode: Video.RESIZE_MODE_CONTAIN,
          source: {
            uri: route.params.file,
          },
          ref: refVideo,
        }}

        fullscreen={{
          inFullscreen: inFullscreen,
          enterFullscreen: async () => {
            setShowHeader(false);
            setStatusBarHidden(true, 'fade')
            setInFullsreen(!inFullscreen)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
            refVideo.current.setStatusAsync({
              shouldPlay: true,
            })
          },
          exitFullscreen: async () => {
            setShowHeader(true);
            setStatusBarHidden(false, 'fade')
            setInFullsreen(!inFullscreen)
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
          },
        }}
        style={{
          videoBackgroundColor: GlobalColors.dcGrey,
          controlsBackgroundColor: GlobalColors.dcGrey,
          height: inFullscreen ? Dimensions.get('window').height : 290,

        }}
      />
    </View>
  )

  return (
    <VideoPlayer
      fullscreen={true}
      videoProps={{
        shouldPlay: true,
        resizeMode: Video.RESIZE_MODE_CONTAIN,
        // source is required https://docs.expo.io/versions/latest/sdk/video/#props
        source: {
          uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
      }}
    />
  )


  return (
    <Video
      ref={refVideo}
      shouldPlay={true}
      style={{height: 300, backgroundColor: GlobalColors.dcGrey}}
      source={{
        uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      }}
      useNativeControls={true}
      resizeMode="contain"
      isLooping={true}
    />
  )
  */

}

export default VideoPlayerScreen;
