import { View, Text, Dimensions } from "react-native";
import React from "react";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Ionicons";

const index = ({
  type,
  text,
}: {
  type: "success" | "warning" | "danger";
  text: string;
}) => {
    const width = Dimensions.get("window").width;
  return (
    <View
      style={{
        backgroundColor: colors.black,
        paddingVertical: 8,
        borderRadius: 5,
        maxWidth: width / 1.5,
        minWidth: width / 1.7,
        height: 50,
        justifyContent: "center",
        paddingRight: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 50,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            backgroundColor:
              type === "success"
                ? colors.success
                : type === "warning"
                ? colors.warning
                : colors.danger,
            width: 10,
            height: "100%",
            marginRight: 8,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            transform: [
              {
                translateX: -1,
              },
            ],
          }}
        />
        <Icon
          selectable={false}
          name={type == "success" ? "happy" : "sad"}
          color={colors.white}
          size={20}
        />
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          selectable={false}
          style={{
            color: colors.white,
            marginLeft: 8,
            flex: 1,
            fontSize: 12,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
};

export default index;
