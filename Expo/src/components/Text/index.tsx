import React from "react";
import { Text, ITextProps } from "native-base";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

interface IText extends ITextProps {
  type?: "regular" | "bold";
}

const Index = (props: IText) => {
  return (
    <Animated.View entering={FadeIn} layout={Layout}>
      <Text
        {...props}
        style={[
          {
            fontFamily: props?.type == "bold" ? "MontserratBold" : "Montserrat",
          },
          props.style,
        ]}
      />
    </Animated.View>
  );
};

export default Index;
