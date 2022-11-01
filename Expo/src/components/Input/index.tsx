import React from "react";
import {
  Input,
  IInputProps,
  FormControl,
  WarningOutlineIcon,
  IFormControlProps,
} from "native-base";
import Text from "../Text";

import Animated, { Layout } from "react-native-reanimated";

interface IInputs extends IInputProps {
  errorMsg?: string;
  label?: string;
  containerProps?: IFormControlProps;
  typeText?: "regular" | "bold";
}
const Inputs = (props: IInputs) => {
  return (
    <Animated.View layout={Layout}>
      <FormControl
        isInvalid={props?.errorMsg != null}
        {...props?.containerProps}
      >
        {props?.label && (
          <FormControl.Label>
            <Text
              type="bold"
              style={{
                fontSize: 15,
              }}
            >
              {props?.label}
            </Text>
          </FormControl.Label>
        )}
        <Input
          variant={"underlined"}
          fontSize={15}
          {...props}
          style={[
            {
              fontFamily:
                props?.typeText == "bold" ? "MontserratBold" : "Montserrat",
            },
            props.style,
          ]}
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {props?.errorMsg}
        </FormControl.ErrorMessage>
      </FormControl>
    </Animated.View>
  );
};

export default Inputs;
