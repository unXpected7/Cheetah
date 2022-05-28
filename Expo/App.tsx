import "react-native-reanimated";
import { View, StatusBar } from "react-native";
import React from "react";
import { colors } from "./src/utils";
import Navigator from "./src/navigator";
import { NativeBaseProvider } from "native-base";
import { useFonts } from "expo-font";
import { Montserrat, MontserratBold } from "./assets/fonts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux";

const Index = () => {
  const [loaded] = useFonts({
    Montserrat,
    MontserratBold,
  });
  if (!loaded)
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={{ flex: 1 }} />
        </PersistGate>
      </Provider>
    );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.secondary} barStyle="light-content" />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NativeBaseProvider>
            <Navigator />
          </NativeBaseProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default Index;
