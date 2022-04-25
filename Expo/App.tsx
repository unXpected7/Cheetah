import 'react-native-reanimated'
import { View, Text, StatusBar } from "react-native";
import React from "react";
import { colors } from "./src/utils";
import Navigator from "./src/navigator";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import { Montserrat, MontserratBold } from "./assets/fonts";

const Index = () => {
  const [loaded] = useFonts({
    Montserrat,
    MontserratBold,
  });
  if (!loaded) return null;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.secondary} barStyle="light-content" />
      <NativeBaseProvider>
        <Navigator />
      </NativeBaseProvider>
    </View>
  );
};

export default Index;
