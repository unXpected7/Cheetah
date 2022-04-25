import { Pressable, Image, useWindowDimensions, FlatList } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { Header } from "./Components";
import { Input, Text } from "../../components";
import ISample, { Datum } from "./interface";
import { Avatar, View } from "native-base";
import dayjs from "dayjs";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutUp,
  Layout,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  ZoomIn,
  ZoomOut,
  ZoomOutEasyUp,
  ZoomOutUp,
} from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGesture,
} from "react-native-gesture-handler";
const sample: ISample = require("./sample.json");
const { data } = sample;
const nickname = "beta_tester";

const Message = ({
  item,
  isReply = false,
}: {
  item: Datum;
  isReply?: boolean;
}) => {
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

const RenderItem = ({
  item,
  scrollToItem,
  addReply,
}: {
  item: Datum;
  scrollToItem: (item: any) => void;
  addReply: (item: Datum) => void;
}) => {
  const x = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });
  // useDerivedValue(() => {
  //   runOnJS(addReply)(item);
  // });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: x.value, y: 0 };
    })
    .onUpdate(({ x: xG }) => {
      if (xG > 0 && xG < 200) {
        x.value = xG;
      }
    })
    .onEnd(({ x: xG }) => {
      x.value = withSpring(0);
      if (xG > 100) {
        runOnJS(addReply)(item);
      }
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    };
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View entering={FadeIn} layout={Layout}>
        {item?.reply != null && (
          <Pressable
            onPress={() => {
              // alert(item?.replyId)
              scrollToItem(item?.replyId);
            }}
          >
            <View flexDirection={"row"} alignItems="flex-end">
              <Icon
                name="return-up-forward-outline"
                size={25}
                color={colors.black}
                style={{
                  marginBottom: 20,
                  marginLeft: 20,
                  marginRight: 5,
                }}
              />
              <Message isReply item={item?.reply} />
            </View>
          </Pressable>
        )}
        <GestureDetector gesture={gesture}>
          <Animated.View style={animatedStyle}>
            <Icon
              name="return-up-forward-outline"
              size={30}
              color={colors.secondary}
              style={{
                position: "absolute",
                left: -80,
                top: 20,
              }}
            />
            <Message item={item} />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

interface ITextInput {
  reply?: Datum;
  cancelReply: () => void;
}
const TextInput = ({ reply, cancelReply }: ITextInput) => {
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
          <Pressable>
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

const Index = () => {
  const ref = useRef<FlatList<Datum>>(null);
  const [reply, setReply] = useState<Datum>();
  const cancelReply = () => setReply(undefined);
  const addReply = (data: Datum) => {
    setReply(data);
  };

  const scrollToItem = (id: number) => {
    if (ref.current) {
      const index = data.findIndex((item) => item.id === id);
      ref.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };
  const MemoizedFlatlist = useMemo(() => {
    return (
      <FlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        inverted
        data={data}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            scrollToItem={scrollToItem}
            addReply={addReply}
          />
        )}
        keyExtractor={(item) => item?.id.toString()}
      />
    );
  }, [data]);

  const MemoizedTextInput = useMemo(
    () => <TextInput reply={reply} cancelReply={cancelReply} />,
    [reply]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {MemoizedFlatlist}
        {MemoizedTextInput}
      </View>
    </View>
  );
};

export default Index;
