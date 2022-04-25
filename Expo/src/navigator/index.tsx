import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, ImageView, Login, Register } from "../screens";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const isLogin = false;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        // initialRouteName="Home"
      >
        {isLogin ? (
          <Stack.Group>
            {/* Auth Guard Screens */}
            <Stack.Screen name="Home" component={Home} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {/* Login Screens */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ImageView" component={ImageView} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
