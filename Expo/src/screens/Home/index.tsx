import { View, Text, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { HStack } from "native-base";
import { Header } from "./Components";
import { Input } from "../../components";

const Index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1 }} />
      <View
        style={{
          width: "100%",
          borderTopWidth: 1,
          borderColor: colors.grey + "aa",
          paddingHorizontal: 10,
        }}
      >
        <Input
          variant={"unstyled"}
          style={{ borderColor: colors.grey }}
          background="amber.100"
          p="4"
          maxH={"32"}
          multiline={true}
          InputLeftElement={
            <Icon name="link-outline" size={25} color={colors.greyBold} />
          }
          InputRightElement={
            <Pressable>
              <Icon name="send" size={25} color={colors.greyBold} />
            </Pressable>
          }
        />
      </View>
    </View>
  );
};

export default Index;
