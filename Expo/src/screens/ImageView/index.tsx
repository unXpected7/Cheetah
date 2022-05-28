import React from "react";
import { colors } from "../../utils";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { View } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { Pressable } from "react-native";

const Index = () => {
  const params: any = useRoute().params;
  const uri: string = params?.uri;
  const scale = useSharedValue(1);
  const gesturePinch = Gesture.Pinch()
    .onUpdate(({ scale: gscale }) => {
      scale.value = gscale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const nav: NavigationProp<any> = useNavigation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.black,
        }}
      >
        <GestureDetector gesture={gesturePinch}>
          <Animated.Image
            source={{ uri }}
            style={[
              {
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              },
              animatedStyle,
            ]}
          />
        </GestureDetector>
        <View position={"absolute"} top={"4"} left="4">
          <Pressable onPress={() => nav.goBack()}>
            <Icon name="arrow-back" size={25} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;
