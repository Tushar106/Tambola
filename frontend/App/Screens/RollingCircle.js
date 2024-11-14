import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RollingCircle = () => {
  const radius = 30; // Circle radius
  const strokeWidth = 8; // Circle border thickness
  const circumference = 2 * Math.PI * radius;

  // Shared value for animation
  const progress = useSharedValue(0);

  useEffect(() => {
    // Animate the progress value from 0 to 1 repeatedly
    progress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1 // Infinite repetition
    );
  }, []);

  // Animated props for the circle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  return (
    <View style={styles.container}>
      <Svg height="70" width="70">
        {/* Background Circle */}
        <Circle
          cx="35"
          cy="35"
          r={radius}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Circle */}
        <AnimatedCircle
          cx="35"
          cy="35"
          r={radius}
          stroke="#ffcc00"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      {/* Display the Current Number */}
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>5</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  numberText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RollingCircle;
