import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Platform,
} from 'react-native';
import {GlobalStyles, GlobalColors} from '../styles/dcstyles';
import {PrimaryButton} from '../shared/basicComponents'
import { useFocusEffect } from '@react-navigation/native';
import Storage from '../shared/storage';
import Settings from '../shared/settings';
import {LoadingView} from '../shared/basicComponents';
import moment from 'moment'
import {AuthContext} from '../routes/drawer';

const backgroundImagePath = '../assets/images/timetable-background.png';
let signOutHook;

async function fetchTimetable(userData){

  try {
    let response = await fetch(Settings.siteUrl + '/timetable/get/', {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": "Token " + userData.token,
      },
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json();

    if(data.timetable){
      return data.timetable;
    }
    else{
      throw data.errors;
    }
  } catch (e) {
    console.log(`Fetch Timetable: ${e}`);
  }
  return null;
}

const TimeTable = ({navigation, userData}) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [timetable, setTimetable] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {

      async function load(){
        try {
          if(!timetable || timetable.length === 0){
            let cached_timetable = await Storage.get('timetable');
            setTimetable(cached_timetable);
          }
          let timetable_data = await fetchTimetable(userData);
          if(timetable_data !== null){
            setTimetable(timetable_data);
            Storage.set('timetable', timetable_data);
          }

        } catch (e) {
          console.log(`Timetable useFocusEffect: ${e}`);
        }
      }

      load();

    }, [])
  );

  if(!timetable || timetable.length === 0){
    return (
      <View style={{flex: 1, backgroundColor: GlobalColors.dcGrey}}>
        <LoadingView text={'Fetching Timetable'} useBackground={true}/>
      </View>
    )
  }

  return (
    <View style={GlobalStyles.container}>
      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.timetableContainer}>
            <View>
              <Text style={styles.titleText}>CLASS{"\n"}TIMETABLE </Text>
              <View style={{marginVertical: 10, marginLeft: 0, width: 160}}>
                <PrimaryButton square text={'Book Now'} onPress={() => navigation.navigate("BookClass")}/>
              </View>
              <DayView timetable={timetable}/>
              <View style={{marginBottom: 30, marginTop: -10, width: 160}}>
                <PrimaryButton square text={'Book Now'} onPress={() => navigation.navigate("BookClass")}/>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const DayView = ({timetable, dayName}) => {
    return timetable.map( (day, i) => {
      return(
        day.classes.length > 0
        ?
        (
        <View key={i} style={styles.dayView}>
          <View style={styles.line}></View>
          <Text style={styles.dayText}>{day.name} </Text>
          <View style={styles.classesView}>
            <TimeView day={day.classes}/>
            <ClassView day={day.classes}/>
            <InstructorView day={day.classes}/>
          </View>
        </View>
      ) : (
        null
      )
    )
    })
}

const TimeView = ({day}) => {

  const [liveViewWidth, setLiveViewWidth] = React.useState(0);

  function liveViewOnLayout(layoutEvent){
    if(liveViewWidth === 0)
      setLiveViewWidth(layoutEvent.nativeEvent.layout.width);
  }

  return(
    <View style={styles.timeView}>
      {
        day.map( (fitnessClass, i) => {
          let time_from = moment(fitnessClass.time_from, "HH:mm:ss").format("h:mmA");
          let time_to = moment(fitnessClass.time_to, "HH:mm:ss").format("h:mmA");
          if(fitnessClass.live){
            return(
              <View key={i} style={styles.rowStyle}>

                <View onLayout={(layoutEvent) => liveViewOnLayout(layoutEvent)}
                  style={{
                    backgroundColor : '#d2232a',
                    position: 'absolute',
                    right: liveViewWidth * 2,
                    paddingVertical: 0,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    paddingLeft: 10,
                    paddingRight: 20,
                  }}>
                  <Text style={[styles.liveText, styles.isLiveStyle]}>LIVE</Text>
                </View>

                <View style={styles.liveView}>
                  <Text style={[styles.classText, {backgroundColor : styles.isLiveStyle.backgroundColor}]}>
                  {`${time_from}-${time_to}`}
                  </Text>
                </View>
              </View>
            )
          }
          else
          {
            return(
              <View key={i} style={styles.rowStyle}>
                <Text style={styles.classText}>{`${time_from}-${time_to}`}</Text>
              </View>
            )
          }
        })
      }
    </View>
  )
}

const ClassView = ({day}) => {
  return (
    <View style={styles.classView}>
      {
        day.map( (fitnessClass, i) => {
          return(
            <View key={i} style={styles.rowStyle}>
              <Text style={styles.classText}>{fitnessClass.excercise}</Text>
            </View>
          )
        })
      }
    </View>
  )
}

const InstructorView = ({day}) => {
  return(
    <View style={styles.instructorView}>
      {
        day.map( (fitnessClass, i) => {
          return(
            <View key={i} style={styles.rowStyle}>
              <Text style={styles.classTextRightSide} >{fitnessClass.instructor}</Text>
            </View>
          )
        })
      }
    </View>
  )
}

export default TimeTable;

const styles = StyleSheet.create({
  backgroundImage : {
    flex: 1,
    resizeMode: "cover",
    alignItems : 'center',
  },
  titleText : {
    color : '#FFC300',
    marginTop : 20,
    marginBottom : 20,
    fontSize : 60,
    fontWeight: Platform.OS === 'android' ? null: 'bold',
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
  },
  timetableContainer : {
    marginLeft: 30,
    alignItems : 'center',
  },
  scrollView : {
      width : '100%',
  },
  line : {
    borderBottomColor : '#FFC300',
    borderBottomWidth: 1,
    marginBottom : 8,
  },
  dayText : {
    color : '#FFC300',
    marginBottom : 10,
    fontSize : 45,
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Regular': 'BebasNeue',
  },
  classText : {
    color : '#FFFFFF',
    textAlign : 'left',
    fontSize : 21,
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Regular': 'BebasNeue',
  },
  liveText : {
    color : '#FFFFFF',
    textAlign : 'left',
    fontSize : 21,
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
    marginRight : Platform.OS === 'android' ? -5 : 5
  },
  classTextRightSide : {
    color : '#FFFFFF',
    textAlign : 'right',
    fontSize : 21,
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Regular': 'BebasNeue',
  },

  // Views
  classesView : {
    flexDirection : 'row',
    alignItems: 'center',
  },
  dayView : {
    marginBottom : 40,
  },
  timeView : {
    marginRight : 1,
  },
  classView : {
    marginHorizontal: 5
  },
  instructorView : {
    marginLeft : 1,
  },
  isLiveStyle : {
  },
  liveView : {
    backgroundColor : '#d2232a',
    paddingVertical: 0,
    paddingRight: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  rowStyle : {
    marginBottom : 5,
  }
});
