import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Linking,
  Button
} from 'react-native';
import {globalStyles, GlobalColors} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {Icon, Avatar} from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// const computeitIconSmall = '../assets/images/cit_logo_simple.png';
const computeitIconLarge = '../assets/images/cit_logo_main.png';

const computeit = ({navigation}) => {
  const [imageViewWidth, setImageViewWidth] = React.useState(0);
  const [imageViewHeight, setImageViewHeight] = React.useState(0);

  function setImageWidthHeight(layout){
    let viewSize = layout.nativeEvent.layout;
    setImageViewWidth(viewSize.width);
    setImageViewHeight(viewSize.height);
  }

  return(
    <View style={{
      backgroundColor: '#083358',
      flex: 1,
    }}> 
      <View 
        
        style={{
          flex: 1,
          margin: 40,
          backgroundColor: '#083358',
        }}>

        <View 
          onLayout={layout => setImageWidthHeight(layout)} 
          style={{
            marginHorizontal: 30,
          }}>
          <Image
            width={imageViewWidth}
            source={require(computeitIconLarge)}
          />
        </View>
      
        
        <Text 
          selectable={true}
          style={{
            textAlign: 'center',
            paddingTop: 40,            
            fontSize: 30,
            color: 'white',
          }}>
            {'This app was built by\n'}
            <Text 
          selectable={true}
          style={{
            textAlign: 'center',
            paddingTop: 40,            
            fontSize: 32,
            color: 'white',
            fontWeight: 'bold'
          }}>
             Compute it ltd
            
        </Text> 
            
        </Text> 

        <Text 
          selectable={true}
          style={{
            textAlign: 'center',
            paddingTop: 40,            
            fontSize: 30,
            color: 'white',
          }}>
            Get in contact if you have an idea for an app or website
        </Text> 
        <TouchableWithoutFeedback 
          style={{
            borderRadius: 30,
            backgroundColor: GlobalColors.dcGrey,
            borderColor: 'white',
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginTop: 30,
          }}
          onPress={() => Linking.openURL('mailto:ben.owen@compute-it.org.uk') }>
          <Text 
            selectable={true}
            style={{       
              fontSize: 23,
              color: 'white',
              textAlign: 'center',
            }}>
              ben.owen@compute-it.org.uk
          </Text> 
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback 
          style={{
            borderRadius: 30,
            backgroundColor: GlobalColors.dcGrey,
            borderColor: 'white',
            borderWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginTop: 30,
          }}
          onPress={() => {
            let number = '07908 461300';
            if (Platform.OS === 'ios') {
            number = 'telprompt:${07908 461300}';
            }
            else {
            number = 'tel:${07908 461300}'; 
            }
            Linking.openURL(number);
          }}>
          <Text 
            selectable={true}
            style={{       
              fontSize: 23,
              color: 'white',
              textAlign: 'center',
            }}>
              07908 461300
          </Text> 
        </TouchableWithoutFeedback>
       
      </View>
    </View>
  )
}



export default computeit;
