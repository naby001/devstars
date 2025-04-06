import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import HomeScreen from './src/screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/store';
import OnboardScreen from './src/screens/Onboard';
import GetStartedScreen from './src/screens/GetStarted';
const Stack = createNativeStackNavigator();
const RootNavigator = () => {
  const user = useSelector((state:any) => state.auth.user); // adjust based on your store slice

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user || !user._id ? (
        <>
          <Stack.Screen name="Login" component={OnboardScreen} />
          <Stack.Screen name="Get Started" component={GetStartedScreen} />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};
const App = () => {
  

GoogleSignin.configure({
  webClientId: 'http://601290465198-gvrsqa1l616jr7pv29fgmfgdvdnm9ro1.apps.googleusercontent.com', // from Firebase console
});

  return (
    <Provider store={store}>
  
<PersistGate loading={null} persistor={persistor}>
    <NavigationContainer>
    <RootNavigator />
    </NavigationContainer>
    </PersistGate>
    </Provider>
  );
};

export default App;
