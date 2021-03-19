import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';

const backgroundImagePath = '../assets/images/timetable-background.png';

function Day(name){
  this.name = name;
}

function FitnessClass(time, name, instructor){
  this.time = time;
  this.name = name;
  this.instructor = instructor;
}

function RandomPerson(){
  var list = ['LEE', 'DAVE', 'WILL', 'JACOB', 'JOANE', 'RYAN'];
  var rnd = (Math.floor(Math.random() * list.length))
  return list[rnd];
}

function RandomClasss(){
  var list = ['EARLY BURN', 'YOGA', 'LIVE STRONG', 'LIFT', 'STRETCH & RELAX', 'TOTAL FITNESS'];
  var rnd = (Math.floor(Math.random() * list.length))
  return list[rnd];
}

function RandomTime(){
  var list = ['7.00AM-8.00AM', '12.00AM-1.00PM', '10.00AM-11.00AM'];
  var rnd = (Math.floor(Math.random() * list.length))
  return list[rnd];
}

function GenerateData (){
  var timetableData = [
    new Day('MONDAY'),
    new Day('TUESDAY'),
    new Day('WEDNESDAY'),
    new Day('THURSDAY'),
    new Day('FRIDAY'),
    new Day('SATURDAY'),
    new Day('SUNDAY')
  ];

  for(let i = 0; i < timetableData.length; i++){
    timetableData[i].classes = Array();
    var rnd = (Math.random() * Math.floor(6)) + 2;
    for(let j = 0; j < rnd; j++){
      var fitnessClass = new FitnessClass(RandomTime(), RandomClasss(), RandomPerson())
      var liveRnd =  (Math.floor(Math.random() * 10));
      fitnessClass.live = liveRnd < 3
      timetableData[i].classes.push(fitnessClass);
    }
  }

  return timetableData;
}

const TimeTable = () => {

  const timetableData = GenerateData();

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require(backgroundImagePath)} style={styles.backgroundImage}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.timetableContainer}>
            <View>
              <Text style={styles.titleText}>CLASS{"\n"}TIMETABLE </Text>
              <DayView/>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const DayView = () => {
    return GenerateData().map( (day, i) => {
      return(
        <View key={i} style={styles.dayView}>
          <View style={styles.line}>
          </View>

          <Text style={styles.dayText}>{day.name} </Text>

          <View style={styles.classesView}>
              <TimeView day={day}/>
              <ClassView day={day}/>
              <InstructorView day={day}/>
          </View>
        </View>
    )
    })
}

const TimeView = ({day}) => {
  return(
    <View style={styles.timeView}>
      {
        day.classes.map( (fitnessClass, i) => {
            if(fitnessClass.live){
              return(
                <View key={i} style={styles.rowStyle}>
                  <View style={styles.liveView}>
                    <Text style={[styles.liveText, styles.isLiveStyle]}>LIVE</Text>
                    <Text style={[styles.classText, {backgroundColor : styles.isLiveStyle.backgroundColor}]}>
                      {fitnessClass.time}
                    </Text>
                  </View>
                </View>
              )
            }
            else
            {
              return(
                <View key={i} style={styles.rowStyle}>
                  <Text style={styles.classText} >{fitnessClass.time}</Text>
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
        day.classes.map( (fitnessClass, i) => {
          return(
            <View key={i} style={styles.rowStyle}>
              <Text style={styles.classText} >{fitnessClass.name}</Text>
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
        day.classes.map( (fitnessClass, i) => {
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
    margin : 'auto',
    marginTop : 20,
    marginBottom : 20,
    fontSize : 60,
    fontFamily : 'BebasNeue Bold'
  },
  timetableContainer : {
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


  // Text
  dayText : {
    color : '#FFC300',
    marginBottom : 10,
    fontSize : 30,
    fontFamily : 'BebasNeue Regular'
  },
  classText : {
    color : '#FFFFFF',
    textAlign : 'left',
    fontSize : 20,
    fontFamily : 'BebasNeue Regular',
  },
  liveText : {
    color : '#FFFFFF',
    textAlign : 'left',
    fontSize : 20,
    fontFamily : 'BebasNeue Bold',
    marginRight : 8

  },
  classTextRightSide : {
    color : '#FFFFFF',
    textAlign : 'right',
    marginLeft : 'auto',
    fontSize : 20,
    fontFamily : 'BebasNeue Regular'
  },


  // Views
  classesView : {
    flexDirection : 'row',
    justifyContent : 'space-between'
  },
  dayView : {
    marginBottom : 40,
  },
  timeView : {
    marginRight : 10,
  },
  classView : {
  },
  instructorView : {
    marginLeft : 10,
  },
  isLiveStyle : {
  },
  liveView : {
    backgroundColor : '#d2232a',
    flexDirection : 'row',
    borderColor: '#d2232a',
    borderRightWidth : 6,
    borderLeftWidth : 6,
    right : 40,
    marginRight : -40,
    borderRadius: 30,
  },
  rowStyle : {
      marginBottom : 4,
  }
});
