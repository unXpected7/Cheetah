import React, { useMemo, useState } from "react";
import { colors } from "../../utils";
import { Pressable, View } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { Button, Text } from "../../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { generateRandomAvatar, IDBType, DBTypeList } from "../../helpers";
import { FlatList, Image, Modal, TouchableOpacity } from "react-native";
import Animated, { Layout, ZoomIn, ZoomOut } from "react-native-reanimated";
import { useRegister } from "../../api/Auth";

const Index = () => {
  const params: { email: string; nickname: string; password: string } =
    useRoute().params as any;
  const { email, nickname, password } = params;

  const [source, setSource] = useState<string>();
  const [type, setType] = useState<IDBType>();
  const [modal, setModal] = useState(false);

  const closeModal = () => {
    setModal(false);
  };
  const { _fetch, loading } = useRegister();

  const nav = useNavigation();

  const MemorizedFlatlist = useMemo(
    () => (
      <FlatList
        data={DBTypeList}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setType(item);
                setSource(generateRandomAvatar(item));
                setModal(true);
              }}
              style={{
                width: "32%",
                marginBottom: "5%",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: generateRandomAvatar(item),
                }}
                style={{
                  width: "75%",
                  aspectRatio: 1,
                }}
              />
              <Text
                type="bold"
                numberOfLines={1}
                ellipsizeMode="tail"
                width={"50%"}
                mt="2"
              >
                {item.includes("neutral")
                  ? `box-${item.substring(0, item.length - 8)}`
                  : item}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    ),
    []
  );

  return (
    <View flex={1}>
      <View
        style={{
          backgroundColor: colors.secondary,
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Pressable onPress={() => nav.goBack()}>
          <Icon name="arrow-back" color={colors.white} size={30} />
        </Pressable>
        <Text ml={"2"} fontSize="xl" color={colors.white} type="bold">
          Choose Your Avatar Type
        </Text>
      </View>
      <View flex={1} p="4">
        {/*   FlatList */}
        {MemorizedFlatlist}
      </View>
      <Modal
        visible={modal}
        transparent
        onRequestClose={loading ? () => {} : () => closeModal()}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              padding: 30,
              borderRadius: 10,
              width: "80%",
              minHeight: "50%",
              alignItems: "center",
            }}
          >
            <Text type="bold" fontSize={"xl"} textTransform="capitalize">
              {(type ?? "adventurer").includes("neutral")
                ? `box-${(type ?? "adventurer").substring(
                    0,
                    (type ?? "adventurer").length - 8
                  )}`
                : type ?? "adventurer"}
            </Text>
            <Animated.View entering={ZoomIn} layout={Layout} exiting={ZoomOut}>
              <Image
                source={{ uri: source ?? generateRandomAvatar("adventurer") }}
                style={{
                  width: "70%",
                  aspectRatio: 1,
                  resizeMode: "contain",
                  marginBottom: "5%",
                }}
              />
            </Animated.View>
            <Button
              disable={loading}
              onPress={() =>
                setSource(generateRandomAvatar(type ?? "adventurer"))
              }
              text="Refresh"
              leftIcon={<Icon name="refresh" size={20} color={colors.white} />}
              type="success"
            />
            <Button
              isLoading={loading}
              text="Confirm Avatar"
              onPress={() => {
                _fetch({
                  email,
                  nickname,
                  password,
                });
              }}
              type="secondary"
              styles={{
                width: "100%",
                marginTop: "10%",
              }}
            />
            <TouchableOpacity
              disabled={loading}
              hitSlop={{
                top: 30,
                bottom: 30,
                left: 30,
                right: 30,
              }}
              style={{
                position: "absolute",
                right: -15,
                top: -15,
                backgroundColor: colors.white,
                borderRadius: 100,
                elevation: 4,
              }}
              onPress={closeModal}
            >
              <Icon name="close" size={40} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Index;
