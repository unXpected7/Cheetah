import { Text, TextStyle, ViewStyle } from "react-native";
import React, { ReactElement } from "react";
import { Button, Spinner } from "native-base";
import { IButtonProps } from "native-base/lib/typescript/components/primitives/Button/types";
import { colors } from "../../utils";

interface IButton {
  onPress: () => void;
  text: string;
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "secondary";
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  styles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disable?: boolean;
  isLoading?: boolean;
  props?: Partial<IButtonProps>;
}

const Index = ({
  onPress,
  text,
  type,
  leftIcon,
  rightIcon,
  styles,
  textStyle,
  disable = false,
  isLoading = false,
  props,
}: IButton) => {
  const secondary =
    type === "secondary"
      ? {
          backgroundColor: colors.secondary,
          color: "#ffffff",
        }
      : {};
  return (
    <Button
      {...props}
      leftIcon={isLoading ? <Spinner color={"white"} /> : leftIcon}
      onPress={onPress}
      colorScheme={
        type === "secondary" ? undefined : type ?? props?.colorScheme
      }
      {...secondary}
      rightIcon={isLoading ? undefined : rightIcon}
      style={styles}
      disabled={isLoading ? true : disable}
    >
      <Text
        selectable={false}
        style={[
          {
            color: "white",
            fontWeight: "bold",
            fontSize: 14,
          },
          textStyle,
        ]}
      >
        {isLoading ? "Loading" : text}
      </Text>
    </Button>
  );
};

export default Index;
