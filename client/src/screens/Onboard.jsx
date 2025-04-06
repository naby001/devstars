import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const OnboardScreen = () => {
    const navigation = useNavigation();
    GoogleSignin.configure({
      webClientId: 'http://601290465198-gvrsqa1l616jr7pv29fgmfgdvdnm9ro1.apps.googleusercontent.com', // from Firebase console
    });
    const handleGoogleLogin = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.idToken;
    
        // Send the ID token to your backend
        const res = await fetch('http://192.168.251.241:5000/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
    
        const data = await res.json();
        console.log('Login Success:', data);
      } catch (error) {
        console.error('Google Sign-In Error:', error);
      }
    };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Name */}
      <Text style={styles.appName}>MovieCove</Text>

      {/* Illustration or Icon */}
      <Image
        source={ require('../assets/images/login.png') }
        style={styles.image}
      />

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Dive into your favorite mixes. Log in to get started.
      </Text>

      {/* Spotify Login */}
      <TouchableOpacity style={styles.spotifyBtn} onPress={()=>{navigation.navigate("Get Started")}}>
        <LinearGradient
          colors={['#1db954', '#1ed760']}
          style={styles.gradientBtn}
        >
          <Image
            source={require('../assets/images/spotify.png')}
            style={styles.icon}
          />
          <Text style={styles.btnText} >Login with Spotify</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Google Login */}
      <TouchableOpacity style={[styles.googleBtn,{marginBottom:20}]}  onPress={()=>{handleGoogleLogin()}}>
        <LinearGradient
          colors={['#ffffff', '#f5f5f5']}
          style={styles.gradientBtn}
        >
          <Image
            source={require('../assets/images/google.png')}
            style={[styles.icon, { width: 24, height: 24 }]}
          />
          <Text style={[styles.btnText, { color: '#000' }]}>
            Login with Google
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.googleBtn,{marginBottom:20}]} onPress={()=>{navigation.navigate("Get Started")}}>
        <LinearGradient
          colors={['#ffffff', '#f5f5f5']}
          style={styles.gradientBtn}
        >
          {/* <Image
            source={require('../assets/images/google.png')}
            style={[styles.icon, { width: 24, height: 24 }]}
          /> */}
          <Text style={[styles.btnText, { color: '#000' }]}>
            Get Started
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e2e',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  appName: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
    fontFamily:'Cherry Bomb One '
  },
  image: {
    width: 600,
    height: 220,
    borderRadius: 20,
    marginBottom: 30,
     resizeMode: 'contain'
  },
  welcomeText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  spotifyBtn: {
    width: '100%',
    marginBottom: 20,
  },
  googleBtn: {
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  icon: {
    width: 28,
    height: 28,
  },
});

export default OnboardScreen;
