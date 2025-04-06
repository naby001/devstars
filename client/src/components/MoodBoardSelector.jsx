import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MoodboardSelector = ({ moodboards, onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (moodboard) => {
    setSelected(moodboard);
    onSelect(moodboard); // callback to parent
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Moodboard</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {moodboards.map((mb) => (
          <TouchableOpacity
            key={mb.id}
            style={[
              styles.moodboardBtn,
              selected?.id === mb.id && styles.selectedBtn,
            ]}
            onPress={() => handleSelect(mb)}
          >
            <Text style={styles.btnText}>{mb.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  moodboardBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 20,
    marginRight: 10,
    height:50,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  },
  selectedBtn: {
    backgroundColor: '#7f5af0',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default MoodboardSelector;
