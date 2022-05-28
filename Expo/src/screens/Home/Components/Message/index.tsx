import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { Avatar, Image, Pressable, View } from "native-base";
import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { IGetChat } from "../../../../api/Chat";
import { Text } from "../../../../components";
import { IRootState } from "../../../../Redux";
import { colors } from "../../../../utils";

const Message = ({
  item,
  isReply = false,
}: {
  item: IGetChat;
  isReply?: boolean;
}) => {
  const { nickname } = useSelector((state: IRootState) => state.Auth);
  const { height } = useWindowDimensions();
  const nav: NavigationProp<any> = useNavigation();
  const RenderMessage = useMemo(
    () => (
      <View
        mb={"4"}
        borderBottomWidth="1"
        py="3"
        px="3"
        borderColor={colors.grey + "aa"}
        flex="1"
        shadow={isReply ? 1 : null}
        borderRadius={isReply ? 10 : 0}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Avatar
            mr={"3"}
            shadow="1"
            bg={colors.white}
            source={{
              uri: item?.user?.avatar,
            }}
          />
          <View>
            <Text
              color={
                nickname == item?.user?.nickname
                  ? colors.secondary
                  : colors.black
              }
              type="bold"
            >
              @{item?.user?.nickname}
            </Text>
            <Text>{item?.message}</Text>
          </View>
          <View flex={1}>
            <Text alignSelf={"flex-end"} fontSize={"xs"}>
              {dayjs(item?.created_at).format("MMM, d YYYY H:mm A")}
            </Text>
          </View>
        </View>
        {item?.attachment != null && (
          <Pressable
            style={{ width: "100%" }}
            onPress={() =>
              nav.navigate("ImageView", {
                uri: item?.attachment,
              })
            }
          >
            <Image
              alt={item?.attachment}
              source={{
                uri: item?.attachment,
              }}
              style={{
                width: "98%",
                height: height / 4,
                marginTop: 10,
                borderRadius: 10,
                alignSelf: "flex-end",
              }}
            />
          </Pressable>
        )}
      </View>
    ),
    [item]
  );
  return RenderMessage;
};

export default Message;
