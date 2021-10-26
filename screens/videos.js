import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import {AuthContext} from '../routes/drawer';
import Settings from '../shared/settings';
import Image from 'react-native-scalable-image';
import moment from 'moment'
import { LoadingView, PrimaryButton }  from '../shared/basicComponents';

let signOutHook;

const PastStreams = ({userData, navigation}) => {
  const [videoPage, setVideoPage] = React.useState(1);
  const [videos, setVideos] = React.useState([]);
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [initialLoadSuccessful, setInitialLoadSuccessful] = React.useState(false);
  const [loadingMoreVideos, setLoadingMoreVideos] = React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1)
  /*
  const [newContentLoaded, setNewContentLoaded] = React.useState(false);
  const [postLengths, setPostLengths] = React.useState({prev: 0, now: 0, item: null});
  */
  const flatlistRef = React.useRef(null);
  const pageLength = 20;

  async function fetchVideos(page){
    try {
      let response = await fetch(Settings.siteUrl + '/video/videos/', {
        method: "POST",
        headers: {
          "Authorization": "Token " + userData.token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          page_length: pageLength,
          page_number: currentPageNumber
        })
      })

      if(response.status == 401 || response.status == 403){
        signOutHook();
        return;
      }

      let data = await response.json()

      if(data.videos && data.videos.length > 0){
        //console.log(data.videos);
        setVideos(data.videos);
        if(initialLoading){
          setInitialLoadSuccessful(true);
          setInitialLoading(false);
        }
        return;
      }
      else{
        console.log(data.errors);
      }

    } catch (e) {
      console.log("Fetch Videos: " + e);
    }
    if(initialLoading){
      setInitialLoadSuccessful(false);
      setInitialLoading(false);
    }
    return null
  }

  // Intial fetch of Page 1.
  async function fetchHistoricVideos(){
    try {
      let response = await fetch(Settings.siteUrl + '/video/videos/', {
        method: "POST",
        headers: {
          "Authorization": "Token " + userData.token,
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          page_length: pageLength,
          page_number: currentPageNumber + 1
        })
      })

      if(response.status == 401 || response.status == 403){
        setLoadingMoreVideos(false);
        signOutHook();
        return;
      }

      let data = await response.json()
      if(data.videos){
        if(data.videos.length > 0){
          let concatVideos = videos.concat(data.videos);
          let newVideos = [];
          Object.assign(newVideos, concatVideos);
          setVideos(newVideos);
          setCurrentPageNumber(currentPageNumber + 1);
        }
        return;
      }
      else{
        console.log(data.errors);
      }
    } catch (e) {
      console.log("Fetch Videos: " + e);
    }
    return null
  }

  React.useEffect(() => {
    if(videos.length === 0){
      console.log('fetching videos...');
      fetchVideos();
    }
  })


  // Works, but have no idea why do not touch
  // Handles to scroll to new content on new content load
  /*
  React.useEffect(() => {
    if(newContentLoaded && postLengths.prev < postLengths.now && postLengths.item != null){
      let avg = flatlistRef.current._listRef._averageCellLength;
      let totalOffset = avg * postLengths.prev;
      flatlistRef.current.scrollToOffset({offset: totalOffset})
      setNewContentLoaded(false);
    }
  }, [posts]);
  */


  async function onVideosEndReached(){
    if(loadingMoreVideos) return;
    setLoadingMoreVideos(true);
    console.log('fetching videos');
    try {
      await fetchHistoricVideos();
    } catch (e) {
      console.log(`End Videos Reached: ${e}`);
    }
    setLoadingMoreVideos(false);
  }

  const renderItem = ({ item }) => {
    return (
      item ?
        <VideoContainer navigation={navigation} video={item}/>
        :
        <View style={{marginVertical: 100}}></View>
    );
  };

  if(initialLoading) {
    return (
      <View style={{flex: 1, backgroundColor: GlobalColors.dcGrey}}>
        <LoadingView useBackground={false} text={'Loading Videos'}/>
      </View>
    )
  }

  if(!initialLoading === !initialLoadSuccessful) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: GlobalColors.dcGrey,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}></View>
        <Text
          style={{
            width: '80%',
            textAlign: 'center',
            color: GlobalColors.dcYellow,
            fontSize: 20,
            marginBottom: 30,
          }}>{'Could not fetch videos. Check your internet connection.'}</Text>
          <View style={{width: '40%', flex: 1}}>
            <PrimaryButton
              text={'Reload'}
              onPress={() => {
                setInitialLoadSuccessful(false);
                setInitialLoading(true);
              }}
            />
          </View>
      </View>
    )
  }

  return(
    <View style={{height: '100%', backgroundColor: GlobalColors.dcGrey}}>
      <FlatList
        keyboardShouldPersistTaps={'handled'}
        ref={flatlistRef}
        data={videos}
        onEndReached={() => onVideosEndReached()}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        keyExtractor={
          (item) => {
            if(item) return item.id;
            return -1;
        }}
      />
      {
        loadingMoreVideos ?
        <LoadingSpinner/>
        :
        null
      }
    </View>

  )
}

var abc = true;

const VideoContainer = ({video, navigation}) => {
  if(abc){
    console.log(video.thumbnail);
    abc = false;
  }

  const [containerWidth, setContainerWidth] = React.useState(0);
  const viewRef = React.useRef();
  let datetime = moment(video.upload_date).format('LL');

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Player', {
          title: video.name,
          id: video.id,
          thumbnail: video.thumbnail
        });
      }}
      onLayout={event => {
        if(containerWidth === 0) setContainerWidth(event.nativeEvent.layout.width);
      }}
      style={{
        overflow: 'hidden',
        flexDirection: 'column',
        backgroundColor: GlobalColors.dcLightGrey,
        marginVertical: 15,
        borderColor: GlobalColors.dcYellow,
        marginHorizontal: 10,
        borderRadius: 15,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      }}
      ref={viewRef}>
      <View style={{
        flex: 1,
        borderBottomWidth: 3,
        borderColor: GlobalColors.dcYellow,
        }}>
        <Image
          width={containerWidth}
          source={{uri: video.thumbnail}}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <View style={{
            width: 5,
            flex: 1,
            borderRadius: 30,
            marginLeft: 20,
            marginVertical: 10,
            backgroundColor: GlobalColors.dcYellow}}>
          </View>
        </View>
        <View style={{flex: 14, marginVertical: 15, marginHorizontal: 15}}>
          <Text
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={{
              color: GlobalColors.dcYellow,
              marginBottom: 10,
              fontSize: 24,
              fontWeight: Platform.OS === 'android' ? null: 'bold',
              fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
              letterSpacing: 1,
          }}>{video.name}</Text>
          <Text style={{
            color: 'white',
            fontWeight: Platform.OS === 'android' ? null: 'bold',
            fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
            fontSize: 18,
            letterSpacing: 1,
          }}>{`${datetime.toString()}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const LoadingSpinner = () => {
  const [viewWidth, setViewWidth] = React.useState(0);
  const windowWidth = Dimensions.get('window').width;

  function setValues(event){
    let width = event.nativeEvent.layout.width;
    setViewWidth(width);
  }

  return(
    <View>
      <ActivityIndicator
        onLayout={event => { setValues(event) }}
        style={{
          position: 'absolute',
          padding: -0,
          right: (windowWidth / 2) - (viewWidth / 2),
          top: -80,
          marginRight: 0,
          alignItems: 'center'
        }}
        size={60}
        color={GlobalColors.dcYellow}
      />
    </View>
  )
}

export default PastStreams;
