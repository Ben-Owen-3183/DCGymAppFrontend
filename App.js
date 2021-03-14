import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Navigator from './routes/drawer';

const App: () => Node = () => {
  return (
    <Navigator/>
  );
};

export default App;
