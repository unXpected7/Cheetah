import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GenerateAvatar, Home, ImageView, Login, Register } from "../screens";
import { useSelector } from "react-redux";
import { IRootState } from "../Redux";

const Index = () => {
  const Stack = createNativeStackNavigator();
  const { isLogin } = useSelector((state: IRootState) => state.Auth);
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
            <Stack.Screen name="ImageView" component={ImageView} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            {/* Login Screens */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="GenerateAvatar" component={GenerateAvatar} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
