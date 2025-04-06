import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import MixesScreen from './Mixes';
import SwipeUI from './SwipeUI';
import { ScrollView } from 'react-native-gesture-handler';
import ScrollableDemoScreen from './Scroll';
import TrendingScreen from './Trending';
import MoodBoardsScreen from './Moods';

const HomeScreen = () => {
    const [activeScreen, setActiveScreen] = useState('Home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <SwipeUI/>;
      case 'Watch Together':
        return <Text style={styles.text}>👥 Watch Together</Text>;
      case 'Swipe':
        return <TrendingScreen/>;
      case 'Campus':
        return <MoodBoardsScreen/>;
      case 'Profile':
        return <Text style={styles.text}>👤 Profile Screen</Text>;
      default:
        return <Text style={styles.text}>🏠 Home Screen</Text>;
    }
  };
  return (
    <View style={styles.container}>
      {renderScreen()}
      <TabBar setActiveScreen={setActiveScreen}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    //backgroundColor: '#323278',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default HomeScreen;
