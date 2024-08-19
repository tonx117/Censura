import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { Image } from "react-native";

const { width, height } = Dimensions.get("window");

const text = ["-----------------------"];

const IndexScreen = () => {
  const [isShown, setShown] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const opacity = useSharedValue(1);
  const titleOffset = useSharedValue(-200);
  const censorTitleOffset = useSharedValue(-200);
  const censorTitleOpacity = useSharedValue(1);
  const bgColor = useSharedValue("transparent");

  useEffect(() => {
    // Cargar el sonido
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/videoplayback.m4a")
        );
        setSound(sound);
      } catch (error) {
        console.error("Error loading sound", error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const toggleSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.stopAsync(); // Detener el sonido
      } else {
        await sound.playAsync(); // Reproducir el sonido
      }
      setIsPlaying(!isPlaying);
    }
  };

  const show = () => {
    if (isShown) {
      opacity.value = withTiming(1, { duration: 1000 });
      titleOffset.value = withSpring(-200, { damping: 10 });
      bgColor.value = withTiming("transparent", { duration: 1000 });
      censorTitleOffset.value = withSpring(0, { damping: 10 });
      censorTitleOpacity.value = withTiming(1, { duration: 1000 });
      // Detener el sonido si está reproduciéndose
      if (isPlaying) {
        toggleSound();
      }
    } else {
      opacity.value = withTiming(0, { duration: 1000 });
      titleOffset.value = withSpring(0, { damping: 10 });
      bgColor.value = withDelay(500, withTiming("purple", { duration: 1000 }));
      censorTitleOffset.value = withSpring(-200, { damping: 10 });
      censorTitleOpacity.value = withDelay(
        500,
        withTiming(0, { duration: 1000 })
      );
      // Reproducir el sonido al mostrar la censura
      toggleSound();
    }
    setShown(!isShown);
  };

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleOffset.value }],
  }));

  const animatedCensorTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: censorTitleOffset.value }],
    opacity: censorTitleOpacity.value,
  }));

  const animatedBgColorStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedBgColorStyle]}>
      <Image
        source={require("../assets/images/omaiga.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <Animated.View
        style={[styles.censorTitleContainer, animatedCensorTitleStyle]}
      >
        <Animated.Text style={styles.censorTitle}>
          Quitale la censura
        </Animated.Text>
      </Animated.View>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.label, animatedTextStyle]}>
          {text[0]}
        </Animated.Text>
      </View>
      <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
        <Animated.Text style={styles.title}>
          No hijo, Dios te observa
        </Animated.Text>
      </Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={show}>
          <Text style={styles.buttonText}>
            {isShown ? "Censurar" : "Descensurar"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  textContainer: {
    position: "absolute",
    top: "48%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
    fontSize: 42,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "black",
    height: 178,
  },
  titleContainer: {
    position: "absolute",
    top: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  censorTitleContainer: {
    position: "absolute",
    top: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  censorTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IndexScreen;
