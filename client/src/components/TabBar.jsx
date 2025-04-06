import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TabBar = ({setActiveScreen}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => setActiveScreen('Home')}>
        <FontAwesome5 name="home" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => setActiveScreen('Campus')}>
          <Image
                  source={require('../assets/images/bookmark-tabbar.png')}
                  style={{ width: 24, height: 24 }}
                />
      </TouchableOpacity>

      {/* Swipe Button Wrapper for the Chalice Effect */}
      {/* <View style={styles.swipeWrapper}> */}
        <TouchableOpacity style={styles.iconButton} onPress={() => setActiveScreen('Swipe')}>
        <Image
                  source={require('../assets/images/compass.png')}
                  style={{ width: 24, height: 24 }}
                />
        </TouchableOpacity>
      {/* </View> */}

      

      <TouchableOpacity style={[styles.iconButton]} onPress={() => setActiveScreen('Watch Together')}>
        <FontAwesome5 name="users" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => setActiveScreen('Profile')}>
        <FontAwesome5 name="user" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconButton: {
    padding: 10,
  },
  swipeWrapper: {
    backgroundColor: '#323278',
    width: 90, // Slightly bigger to create a cutout effect
    height: 90,
    borderRadius: 40, // Ensuring a perfect circular cutout
    
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center', // Center the Swipe button inside
  },
  swipeButton: {
  //  backgroundColor: '#6f88d8',
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    //elevation: 10,
  },
});

export default TabBar;
