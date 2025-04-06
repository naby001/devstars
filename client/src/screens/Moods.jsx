import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const moodboards = [
    { id: '1', name: 'Date Night', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Summer Vacation', image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=600&q=80' },
    { id: '3', name: 'Flight to Goa', image: 'https://images.unsplash.com/photo-1483794344563-d27a8d18014e?auto=format&fit=crop&w=600&q=80' },
    { id: '4', name: 'Murder', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80' },
  
];

const MoodBoardsScreen = () => {
  const renderMoodboard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Your Moodboards</Text>

      {moodboards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Create your own moodboards</Text>
        </View>
      ) : (
        <FlatList
          data={moodboards}
          renderItem={renderMoodboard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false} // <--- Important to allow outer ScrollView to scroll
          contentContainerStyle={styles.grid}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    aspectRatio: 1.2,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    //backgroundColor: 'rgba(0,0,0,0.6)',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: 'gray',
    fontSize: 16,
  },
  grid: {
    paddingBottom: 20,
  },
});

export default MoodBoardsScreen;
