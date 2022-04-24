import React from "react";
import {
  Input,
  IInputProps,
  FormControl,
  WarningOutlineIcon,
  IFormControlProps,
} from "native-base";
import { Text } from "react-native";

interface IInputs extends IInputProps {
  errorMsg?: string;
  label?: string;
  containerProps?: IFormControlProps;
}
const Inputs = (props: IInputs) => {
  return (
    <FormControl isInvalid={props?.errorMsg != null} {...props?.containerProps}>
      {props?.label && (
        <FormControl.Label>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {props?.label}
          </Text>
        </FormControl.Label>
      )}
      <Input variant={"underlined"} {...props} />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props?.errorMsg}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};

export default Inputs;
