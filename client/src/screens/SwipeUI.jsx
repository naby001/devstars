import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import {movieslist} from '../movielist';
import MoodboardSelector from '../components/MoodBoardSelector';
import {useSelector} from 'react-redux';
import {moodboards} from './Moods';
const {width, height} = Dimensions.get('window');

// Color schemes for each gossip card
const colorSchemes = [
  '#ff4b5c', // Bold Red
  '#635acc', // Purple
  '#ff9f00', // Vibrant Yellow
  '#00bcd4', // Cyan
  '#8bc34a', // Green
];

export default function SwipeUI() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState(0);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [showslideup, setshowslideup] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(height)).current;
  const slideAnim = useRef(new Animated.Value(200)).current;
  // const sheetTranslateY = useRef(new Animated.Value(height)).current;
  //let user=useSelector((state)=>state.auth.user);
  const leftImageScale = useRef(new Animated.Value(1)).current; // Scale for the left image
  const rightImageScale = useRef(new Animated.Value(1)).current; // Scale for the right image
  // const dispatch=useDispatch();
  //const {setIsTabBarVisible}=useTabBar();
  const [movies, setmovies] = useState([]);
  const [liking, setliking] = useState(null);
  const [disliking, setdisliking] = useState(null);
  const [saving, setsaving] = useState(false);
  const [playing, setplaying] = useState(null);
  const user = useSelector(state => state.auth.user);
  const [seen, setseen] = useState(0);
  useEffect(() => {
    const handleBackPress = () => {
      if (showDiscussion) {
        closeDiscussion();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [showDiscussion]);

  let lastStatus = null;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      setshowslideup(true);
      lastStatus = null;
    },

    onPanResponderMove: Animated.event(
      [null, {dx: translateX, dy: translateY}],
      {
        useNativeDriver: false,
        listener: (event, gestureState) => {
          const {dx, dy} = gestureState;
          const horizontalThreshold = 30;
          const verticalThreshold = 60;

          let currentStatus = null;

          if (dy < -verticalThreshold) {
            currentStatus = 'play';
          } else if (dy > verticalThreshold) {
            currentStatus = 'save';
          } else if (dx > horizontalThreshold) {
            currentStatus = 'like';
          } else if (dx < -horizontalThreshold) {
            currentStatus = 'dislike';
          }

          // Only update if status changed
          if (currentStatus !== lastStatus) {
            setliking(currentStatus === 'like');
            setdisliking(currentStatus === 'dislike');
            setsaving(currentStatus === 'save');
            setplaying(currentStatus === 'play');
            lastStatus = currentStatus;
          }
        },
      },
    ),

    onPanResponderRelease: (event, gestureState) => {
      const {dx, dy} = gestureState;

      setshowslideup(false);
      setliking(false);
      setdisliking(false);
      //setsaving(null);
      setplaying(null);
      if (dx > 100 || dx < -100) {
        const isLike = dx > 0;
        react(currentIndex, isLike ? true : false);
        //console.log(isLike);
        Animated.timing(translateX, {
          toValue: isLike ? width : -width,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          translateX.setValue(0);
          translateY.setValue(0);
          setSwipedCards(prev => prev + 1);
          setCurrentIndex(prev => prev + 1);
          setviewed(currentIndex);
        });
      } else if (dy < -100) {
        setplaying(true);

        translateX.setValue(0);
        translateY.setValue(0);
      } else {
        // setsaving(null)
        // Reset animation
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });
  const getmovies = async recommend => {
    const data = {userId: user._id};

    try {
      const response = await fetch(
        'http://192.168.251.241:5000/movie/getrecommend',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
        },
      );
      const returneddata = await response.json();
      console.log(returneddata);
      //         const processedMovies = returneddata
      // .map(rec => {
      //   const found = movieslist.find(m => m.id === rec.movieid);
      //   return found
      //     ? {
      //         title: found.primaryTitle,
      //         image: found.primaryImage,
      //         id: found.movieid
      //       }
      //     : null;
      // })
      // .filter(movie => movie !== null); // remove not found ones
      if (!recommend) setmovies(returneddata);
      else setmovies(prev => [...prev, ...returneddata]);
      setviewed(0);
    } catch (error) {}
  };
  useEffect(() => {
    getmovies(false);
  }, []);
  useEffect(() => {
    if (currentIndex < movies.length) {
      translateY.setValue(height); // Start the new card off-screen at the bottom
      Animated.timing(translateY, {
        toValue: 0, // Move to the center of the screen
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex]);

  const react = async (index, like) => {
    //console.log('hello')
    const data = {
      movieId: movies[index].movieid,
      liked: like,
      userId: user._id,
    };
    const seen1 = seen + 1;
    setseen(seen1);

    try {
      const response = await fetch('http://192.168.251.241:5000/movie/swipe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const returnedmsg = await response.json();
      if (seen1 % 3 === 0) {
        getmovies(true);
      }
      console.log(returnedmsg);
    } catch (error) {
      console.log(error);
    }
  };

  const setviewed = async index => {
    const data = {userid: user._id, rippleid: movies[index]._id};
    try {
      const response = await fetch('http://192.168.31.12:5000/ripple/view', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const returneddata = await response.json();
      console.log(returneddata);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      //colors={['#6c63ff', '#f3c13f']}
      style={styles.container}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
            fontFamily: 'CherryBombOne-Regular',
          }}>
          MovieCove
        </Text>
      </View>

      {/* <Text style={[{color:'white', fontWeight:700, fontSize:28, position:'absolute', top:10}]}>Trending</Text> */}
      {showslideup && (
        <Animated.View
          style={[{top: 70, position: 'absolute', flexDirection: 'row'}]}>
          <Animated.Image
            source={require('../assets/images/dislike.png')}
            style={{
              width: leftImageScale.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0, 40], // Adjust based on your requirements
              }),
              height: leftImageScale.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0, 40],
              }),
              marginRight: 40,
            }}></Animated.Image>

          <Animated.Image
            source={require('../assets/images/like.png')}
            style={{
              marginLeft: 40,
              width: rightImageScale.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0, 60], // Adjust based on your requirements
              }),
              height: rightImageScale.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0, 60],
              }),
            }}></Animated.Image>
          <Animated.Image
            source={require('../assets/images/bookmark.png')}
            style={{
              marginLeft: 40,
              width: rightImageScale.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0, 60], // Adjust based on your requirements
              }),
              height: rightImageScale.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0, 60],
              }),
            }}></Animated.Image>
        </Animated.View>
      )}
      {currentIndex < movies.length ? (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                {translateX: translateX},
                {translateY: translateY},
                {
                  rotate: translateX.interpolate({
                    inputRange: [-width, 0, width],
                    outputRange: ['-15deg', '0deg', '15deg'],
                  }),
                },
              ],
            },
          ]}>
          <ImageBackground
            source={{uri: movies[currentIndex].image}}
            style={styles.backgroundImage}
            resizeMode="cover">
            {liking === true && (
              <Image
                source={require('../assets/images/like.png')}
                style={{width: 160, height: 160}}
              />
            )}
            {disliking === true && (
              <Image
                source={require('../assets/images/dislike.png')}
                style={{width: 160, height: 160}}
              />
            )}
            {saving === true && (
              <Image
                source={require('../assets/images/bookmark.png')}
                style={{width: 160, height: 160}}
              />
            )}
            {playing === true && (
              <Image
                source={require('../assets/images/play-button.png')}
                style={{width: 160, height: 160}}
              />
            )}
            <View style={styles.gossipText}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                <Text style={{fontSize: 24, color: 'white', marginRight: 8}}>
                  {movies[currentIndex].title}
                </Text>
                <View
                  style={{
                    backgroundColor: 'grey',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 6,
                    marginTop: 20,
                    marginRight: 8,
                  }}>
                  <Text style={{color: 'white', fontSize: 12}}>
                    {movies[currentIndex].rating}
                  </Text>
                </View>
                <Text style={{color: 'white', fontSize: 15}}>
                  {movies[currentIndex].startYear}
                </Text>
              </View>

              <Text style={{fontSize: 15, color: 'grey', marginTop: 8}}>
                {movies[currentIndex].description}
              </Text>
            </View>
          </ImageBackground>
          <TouchableOpacity
            style={{position: 'absolute', top: 0, right: 0}}
            onPress={() => {
              const ci = currentIndex + 1;
              setCurrentIndex(ci);
            }}>
            <Entypo
              name="cross"
              size={40}
              color="white"
              style={{opacity: 0.5}}
            />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreText}>You are all caught up!</Text>
        </View>
      )}
      {saving && (
        <>
          <TouchableWithoutFeedback onPress={() => setsaving(null)}>
            <View
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet]}>
            {/* <CommentSection/> */}
            <MoodboardSelector
              moodboards={[
                {id: 1, name: 'Date Night'},
                {id: 2, name: 'Summer Vacation'},
                {id: 3, name: 'Flight to Frankfurt'},
              ]}
              onSelect={selectedMoodboard => {
                const fullMoodboard = moodboards.find(
                  mb => mb.id === selectedMoodboard.id,
                );
                if (fullMoodboard) {
                  fullMoodboard.movieIds.push(movies[currentIndex].movieid);
                  const ci = currentIndex;
                  setCurrentIndex(ci + 1);
                  setsaving(false);
                }
              }}
            />
          </Animated.View>
        </>
      )}

      {playing && (
        <>
          <TouchableWithoutFeedback onPress={() => setplaying(null)}>
            <View
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet]}>
            {/* <CommentSection/> */}
            <MoodboardSelector
              moodboards={[
                {
                  id: 1,
                  name: 'JioHotstar',
                  logo: '../assets/images/hotstar.png',
                  link: 'https://www.hotstar.com',
                },
                {
                  id: 2,
                  name: 'Netflix',
                  logo: '../assets/images/netflix.jpeg',
                  link: 'https://www.netflix.com',
                },
                {
                  id: 3,
                  name: 'AmazonPrimeVideo',
                  logo: '../assets/images/amazon.png',
                  link: 'https://www.primevideo.com',
                },
              ]}
              ott={true}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.link)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Image
                    source={item.logo}
                    style={{width: 40, height: 40, marginRight: 10}}
                    resizeMode="contain"
                  />
                  <Text style={{color: 'white', fontSize: 16}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              onSelect={selectedMoodboard => {
                const fullMoodboard = moodboards.find(
                  mb => mb.id === selectedMoodboard.id,
                );
                if (fullMoodboard) {
                  fullMoodboard.movieIds.push(movies[currentIndex].movieid);
                  const ci = currentIndex;
                  setCurrentIndex(ci + 1);
                  setsaving(false);
                }
              }}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    //backgroundColor: '#323278',
    //padding:20,
    //justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  card: {
    width: width * 0.92,
    height: height * 0.8,
    borderRadius: 16,
    elevation: 5,
    //justifyContent: 'center',
    //alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Adjust as needed
    alignItems: 'center', // Adjust as needed
    borderRadius: 16,
  },
  gossipText: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,

    fontWeight: 'bold',
    color: 'white',
    //textAlign: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.8)', // ✅ Semi-transparent black background
    paddingVertical: 10, // ✅ Adds some top & bottom spacing inside the box
    paddingHorizontal: 15, // ✅ Adds side padding
    //borderRadius: 12,      // ✅ Smooth rounded edges for a sleek look
    overflow: 'hidden', // ✅ Ensures the radius applies properly
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 400,
    backgroundColor: '#282a3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },

  noMoreCards: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 20,
    color: 'lightgrey',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.3,
    backgroundColor: '#282a3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  discussion: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  discussionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  discussionText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});