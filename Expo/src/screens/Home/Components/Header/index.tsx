import { View, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { HStack } from "native-base";
import { Text } from "../../../../components";
import { useDispatch } from "react-redux";
import { resetAuthLogout } from "../../../../redux/Auth/Actions";

interface IHeader {
  online: string;
  writing: string | null;
}

const Header = ({ online, writing }: IHeader) => {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => setModalVisible(false);
  const openModal = () => setModalVisible(true);
  const dispatch = useDispatch();
  return (
    <View
      style={{
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Icon name="people" size={25} color={colors.white} />
        <Text
          style={{
            color: colors.white,
          }}
        >
          {writing || `${online} users online`}
        </Text>
      </View>
      <Pressable onPress={openModal}>
        <Icon name="ellipsis-vertical" size={25} color={colors.white} />
      </Pressable>
      <Modal visible={modalVisible} transparent onRequestClose={closeModal}>
        <Pressable
          onPress={closeModal}
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              padding: 20,
              elevation: 10,
            }}
          >
            <Pressable onPress={closeModal}>
              <HStack
                minW={"20"}
                justifyContent="space-between"
                alignItems={"center"}
                py="2"
              >
                <Text
                  type="bold"
                  style={{
                    marginRight: 10,
                  }}
                >
                  My Profile
                </Text>
                <Icon
                  name="color-wand-outline"
                  size={18}
                  color={colors.black}
                />
              </HStack>
            </Pressable>
            <Pressable
              onPress={() => {
                closeModal();
                dispatch(resetAuthLogout());
              }}
            >
              <HStack
                minW={"20"}
                justifyContent="space-between"
                alignItems={"center"}
                py="2"
              >
                <Text
                  type="bold"
                  style={{
                    marginRight: 10,
                  }}
                >
                  Logout
                </Text>
                <Icon name="exit-outline" size={18} color={colors.black} />
              </HStack>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Header;
