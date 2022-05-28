import { Pressable, View } from "native-base";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, Layout, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "../../../../utils";
import Message from "../Message";
import { IGetChat } from "../../../../api/Chat";
const GD: any = GestureDetector;

const RenderItem = ({
    item,
    scrollToItem,
    addReply,
  }: {
    item: IGetChat;
    scrollToItem: (item: any) => void;
    addReply: (item: IGetChat) => void;
  }) => {
    const x = useSharedValue(0);
    const context = useSharedValue({ x: 0, y: 0 });
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
        if (xG > 50) {
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
          <GD gesture={gesture}>
            <Animated.View style={animatedStyle}>
              <Icon
                name="return-up-forward-outline"
                size={30}
                color={colors.secondary}
                style={{
                  position: "absolute",
                  left: -40,
                  top: 20,
                }}
              />
              <Message item={item} />
            </Animated.View>
          </GD>
        </Animated.View>
      </GestureHandlerRootView>
    );
  };

    export default RenderItem;