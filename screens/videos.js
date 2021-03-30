import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native';
import {globalStyles} from '../styles/dcstyles';

const PastStreams = () => {
  return (
    <View>
      <ScrollView syle={styles.scrollView}>

      </ScrollView>
    </View>
  );
}

export default PastStreams;

const styles = StyleSheet.create({
  scrollView : {
    marginHorizontal : 10,
    marginVertical : 5
  }
});
