import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setlogin } from '../store/authSlice';
const { width } = Dimensions.get('window');

const GetStartedScreen = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [isStudent, setIsStudent] = useState(null);
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [email, setemail]=useState('');
  const dispatch=useDispatch();
  const totalSteps = isStudent ? 6 : 5;

    const navigation = useNavigation();
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleStart = async() => {
     try {
      const data={username, city, isStudent, university, password, email, password};
      const response=await fetch('http://192.168.251.241:5000/user/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      });
      const returneddata=await response.json();
      dispatch(setlogin({ user: returneddata }));
      navigation.navigate("Home");
     } catch (error) {
      console.log(error);
     }
  };

  const renderProgressBar = () => {
    const progress = (step / totalSteps) * 100;
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#888"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              onSubmitEditing={nextStep}
            />
            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
        case 2:
          return (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry
                value={email}
                onChangeText={setemail}
                onSubmitEditing={nextStep}
              />
              <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                <Text style={styles.btnText}>Next</Text>
              </TouchableOpacity>
            </View>
          );
        case 3:
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>Create a password</Text>
      <TextInput
        placeholder="Enter password"
        placeholderTextColor="#888"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={nextStep}
      />
      <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Where do you live?</Text>
            <TextInput
              placeholder="Enter your city"
              placeholderTextColor="#888"
              style={styles.input}
              value={city}
              onChangeText={setCity}
              onSubmitEditing={nextStep}
            />
            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
              <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Are you a student?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.choiceBtn,
                  isStudent === true && styles.selectedBtn,
                ]}
                onPress={() => {
                  setIsStudent(true);
                  setStep(6);
                }}
              >
                <Text style={styles.btnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.choiceBtn,
                  isStudent === false && styles.selectedBtn,
                ]}
                onPress={() => {
                  setIsStudent(false);
                }}
              >
                <Text style={styles.btnText}>No</Text>
              </TouchableOpacity>
            </View>
            {isStudent === false && (
              <TouchableOpacity style={styles.nextBtn} onPress={()=>{ navigation.navigate("Home");}}>
                <Text style={styles.btnText}>Start Enjoying</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Enter your university</Text>
            <TextInput
              placeholder="University Name"
              placeholderTextColor="#888"
              style={styles.input}
              value={university}
              onChangeText={setUniversity}
            />
            <TouchableOpacity style={styles.nextBtn} onPress={()=>{ handleStart();}}>
              <Text style={styles.btnText}>Start Enjoying</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {renderProgressBar()}
      {renderStep()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#333',
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7f5af0',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2e2e3e',
    width: '100%',
    padding: 16,
    fontSize: 16,
    borderRadius: 10,
    color: 'white',
    marginBottom: 20,
  },
  nextBtn: {
    backgroundColor: '#7f5af0',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  choiceBtn: {
    backgroundColor: '#444',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  selectedBtn: {
    backgroundColor: '#7f5af0',
  },
});

export default GetStartedScreen;
