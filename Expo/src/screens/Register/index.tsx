import { View, StyleSheet } from "react-native";
import React from "react";
import { Button, Input, Text } from "../../components";
import { colors } from "../../utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Pressable } from "native-base";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

const Index = () => {
  const nav: NavigationProp<any> = useNavigation();

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <Text type="bold" fontSize={"5xl"} mt="4">
        Sign Up
      </Text>
      <Input
        label="Email"
        placeholder="Enter Your Email"
        containerProps={{
          mt: "12",
        }}
      />
      <Input
        label="Nick Name"
        placeholder="Enter Your Nickname"
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
      <Input
        label="Retype Password"
        placeholder="Re-Enter Your Password"
        secureTextEntry
        containerProps={{
          mt: "4",
        }}
      />
      <Animated.View layout={Layout}>
        <Button
          onPress={() => nav.navigate("Home")}
          text="Sign Up!"
          type="secondary"
          props={{
            mt: "6",
            py: "3",
          }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Already have an Account ? </Text>
          <Pressable onPress={() => nav.navigate("Login")}>
            <Text style={styles.textBlue}>Sign in !</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 40,
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
    fontWeight: "bold",
  },
});
