import { Avatar, Pressable, View } from "native-base";
import React, { useState } from "react";
import Animated, {
  Layout,
  ZoomIn,
  ZoomOutEasyUp,
} from "react-native-reanimated";
import { Input, Text } from "../../../../components";
import { colors } from "../../../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { IRootState } from "../../../../Redux";
import { IGetChat } from "../../../../api/Chat";
import { Keyboard } from "react-native";

interface ISendChat {
  message: string;
  userId: number;
  replyId?: number;
  attachment?: string;
}

interface ITextInput {
  reply?: IGetChat;
  cancelReply: () => void;
  sendChat: (data: ISendChat) => void;
}
const Index = ({ reply, cancelReply, sendChat }: ITextInput) => {
  const { nickname, id } = useSelector((state: IRootState) => state.Auth);
  const [input, setInput] = useState("");
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        marginBottom: 8,
        borderRadius: 30,
        elevation: 5,
      }}
    >
      {reply != null && (
        <Animated.View
          style={{
            flexDirection: "row",
            padding: 20,
          }}
          entering={ZoomIn}
          exiting={ZoomOutEasyUp.duration(100)}
          layout={Layout}
        >
          <Avatar
            mr={"3"}
            shadow="1"
            bg={colors.white}
            source={{
              uri: reply?.user?.avatar,
            }}
            size={"sm"}
          />
          <View style={{ flex: 1, maxWidth: "90%" }}>
            <Text
              color={
                nickname == reply?.user?.nickname
                  ? colors.secondary
                  : colors.black
              }
              type="bold"
            >
              @{reply?.user?.nickname}
            </Text>
            <Text ml={"2"} numberOfLines={2} ellipsizeMode={"tail"}>
              {reply?.message}
            </Text>
          </View>
          <Pressable onPress={cancelReply}>
            <Icon name="close" size={25} color={colors.warning} />
          </Pressable>
        </Animated.View>
      )}
      <Input
        value={input}
        onChangeText={(text) => setInput(text)}
        variant={"unstyled"}
        background="amber.100"
        p="4"
        maxH={"32"}
        multiline={true}
        InputLeftElement={
          <Icon name="link-outline" size={25} color={colors.greyBold} />
        }
        InputRightElement={
          <Pressable
            onPress={() => {
              if (input.length > 0) {
                sendChat({
                  message: input,
                  userId: id,
                  replyId: reply?.id,
                });
                setInput("");
                Keyboard.dismiss();
                cancelReply();
              }
            }}
          >
            <Icon
              name="send"
              size={25}
              color={input === "" ? colors.greyBold : colors.secondary}
            />
          </Pressable>
        }
      />
    </View>
  );
};

export default Index;
