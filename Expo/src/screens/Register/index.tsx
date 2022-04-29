import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import React from "react";
import { Button, Input, Text } from "../../components";
import { colors } from "../../utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Pressable } from "native-base";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useCheckAvailable, useRegister } from "../../api/Auth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const schema = yup
  .object({
    email: yup.string().email().required(),
    nickname: yup.string().min(3).required(),
    password: yup
      .string()
      .min(6)
      .matches(passwordRegex, "must have character and number")
      .required(),
    repassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords did not match"),
  })
  .required();

const Index = () => {
  const nav: NavigationProp<any> = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      repassword: "",
    },
    resolver: yupResolver(schema),
  });

  const { loading, _fetch } = useCheckAvailable();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.container}
      >
        <Text type="bold" fontSize={"5xl"} mt="4">
          Sign Up
        </Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMsg={errors.email?.message}
              label="Email"
              placeholder="Enter Your Email"
              containerProps={{
                mt: "12",
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="nickname"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMsg={errors.nickname?.message}
              label="Nick Name"
              placeholder="Enter Your Nickname"
              containerProps={{
                mt: "4",
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMsg={errors.password?.message}
              label="Password"
              placeholder="Enter Your Password"
              secureTextEntry
              containerProps={{
                mt: "4",
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="repassword"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMsg={errors.repassword?.message}
              label="Retype Password"
              placeholder="Re-Enter Your Password"
              secureTextEntry
              containerProps={{
                mt: "4",
              }}
            />
          )}
        />
        <Animated.View layout={Layout}>
          <Button
            isLoading={loading}
            onPress={handleSubmit(async (data) => {
              const { success } = await _fetch({
                email: data.email,
                nickname: data.nickname,
              });
              success && nav.navigate("GenerateAvatar", data);
            })}
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
    </KeyboardAvoidingView>
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
