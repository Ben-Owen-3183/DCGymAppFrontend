import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import { LoadingView, PrimaryButton }  from '../shared/basicComponents';
import Settings from '../shared/settings';
import { useFocusEffect } from '@react-navigation/native';

const backgroundImagePath = '../assets/images/timetable-background.png';

const LiveStreams = ({navigation, userData}) => {
  const [streamsByDay, setStreamsByDay] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [initialLoadSuccessful, setInitialLoadSuccessful] = React.useState(false);

  async function fetchLiveStreams(){
    try {
      let response = await fetch(Settings.siteUrl + '/video/live_streams/', {
        method: "GET",
        headers: {
          "Authorization": "Token " + userData.token,
          "Content-type": "application/json; charset=UTF-8"
        }
      })

      if(response.status == 401 || response.status == 403){
        signOutHook();
        return;
      }

      let data = await response.json()

      if(data.streams_by_day){
        setStreamsByDay(data.streams_by_day);
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

  /*
  React.useEffect(() => {
    if(streamsByDay === null){
      fetchLiveStreams();
    }
  })
  */

  useFocusEffect(
    React.useCallback(() => {
      fetchLiveStreams();
    }, [])
  );


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
          }}>{'Could not fetch streams. Check your internet connection.'}</Text>
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
    <ImageBackground source={require(backgroundImagePath)} style={{
        flex: 1,
        resizeMode: "cover",
      }}>

      <ScrollView style={{paddingTop: 30, height: '100%'}}>
        <View style={{
          borderRadius: 15,
          paddingRight: 10,
          alignSelf: 'center',
          flexDirection: 'row',
          margin: 40,
          backgroundColor: GlobalColors.dcGrey}}>
          <View style={{
            alignItems: 'center',
            backgroundColor: '#d2232a',
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            paddingHorizontal: 15,
            paddingVertical: 1,
            flexDirection: 'row'
          }}>
            <View style={{
              marginRight: 7,
              height : 0,
              width: 0,
              borderRadius: 100,
              borderColor: 'white',
              borderWidth: 5}}></View>
            <Text style={{
                color: 'white',
                fontSize: 60,
                fontFamily: 'BebasNeue',
                fontWeight: 'bold',
                letterSpacing: 1,
              }}>
              Live
            </Text>
          </View>

          <Text style={{
            paddingRight: 5,
            paddingLeft: 15,
            paddingVertical: 1,
            color: 'white',
            fontSize: 60,
            fontFamily: 'BebasNeue',
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
          Streams
          </Text>
        </View>
        <View style={{marginBottom: 100}}>
          <StreamDays navigation={navigation} streamsByDay={streamsByDay}/>
        </View>
      </ScrollView>
    </ImageBackground>
  )

}

const StreamDays = ({streamsByDay, navigation}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return(
    days.map((day, i) => {
      if(streamsByDay[day].length === 0) return null

      return(
        <View key={i} style={{
          marginHorizontal: 30,
          marginVertical: 10,
        }}>
          <Text style={{
            textAlign: 'center',
            color: GlobalColors.dcYellow,
            fontSize: 45,
            fontFamily: 'BebasNeue',
            fontWeight: 'bold',
            letterSpacing: 1,
            marginTop: 20
          }}>
          {day}
          </Text>
          <ListStreams navigation={navigation} streams={streamsByDay[day]}/>
        </View>
      )
    })
  )
}

const ListStreams = ({streams, navigation}) => {

  return (
    streams.map((stream, i) => {
    // missed this bad boy !
      return (
        <TouchableOpacity key={i}
          onPress={() => {
            navigation.navigate('LiveStream', {
              title: stream.name,
              stream_url: stream.stream_url,
              chat_url: stream.chat_url,
            });
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingVertical: 13,
            marginVertical: 10,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: GlobalColors.dcYellow,
            borderTopWidth: 1,
            borderLeftWidth: 1,
        }}>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontFamily: 'BebasNeue',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
            {stream.name}
          </Text>
          <View style={{
            marginHorizontal: 10,
            borderWidth: 4,
            borderColor: GlobalColors.dcYellow,
            height: 0,
            width: 0,
            borderRadius: 30
          }}></View>
          <Text
            style={{
              color: 'white',
              fontSize: 24,
              fontFamily: 'BebasNeue',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}>
            {stream.time}
          </Text>
        </TouchableOpacity>
      )
    })
  )
}

export default LiveStreams;
