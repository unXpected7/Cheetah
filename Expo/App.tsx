import { View, Text, StatusBar } from "react-native";
import React from "react";
import { colors } from "./src/utils";
import Navigator from "./src/navigator";
import { NativeBaseProvider } from "native-base";

const Index = () => {
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
