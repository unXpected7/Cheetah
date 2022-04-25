import { View, useWindowDimensions, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { Pressable } from "native-base";
import { Button, Input, Text } from "../../components";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const Index = () => {
  const { width } = useWindowDimensions();

  const nav: NavigationProp<any> = useNavigation();

  const [isfinish, setfinished] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setfinished(true);
    }, 1000);
  }),
    [];

  return (
    <View style={styles.container}>
      <Animated.View
        layout={Layout}
        entering={FadeIn.delay(500)}
        exiting={FadeOut}
      >
        <Icon
          name="chatbox-ellipses-outline"
          size={width * 0.42}
          color={colors.primary}
          style={{
            alignSelf: "center",
          }}
        />
      </Animated.View>
      {isfinish && (
        <Animated.View entering={FadeIn.delay(200)} exiting={FadeOut}>
          <Input
            label="Email"
            placeholder="Enter Your email"
            containerProps={{
              mt: "4",
            }}
          />
          <Input
            label="Password"
            placeholder="Enter Your Password"
            secureTextEntry
            containerProps={{
              mt: "4",
            }}
          />
          <Button
            onPress={() => nav.navigate("Home")}
            text="Sign In"
            type="secondary"
            props={{
              mt: "6",
              py: "3",
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Don't have an account ? </Text>
            <Pressable onPress={() => nav.navigate("Register")}>
              <Text type="bold" style={styles.textBlue}>
                Sign up !
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 40,
    justifyContent: "center",
    paddingTop: 20,
  },
  textContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  textBlue: {
    fontSize: 16,
    color: colors.secondary,
  },
});
