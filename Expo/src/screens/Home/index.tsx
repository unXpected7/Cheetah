import { Pressable, Image, useWindowDimensions, FlatList } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { colors } from "../../utils";
import Icon from "react-native-vector-icons/Ionicons";
import { Header, TextInput, Message, RenderItem } from "./Components";
// import { Text } from "../../components";
import { View } from "native-base";

import { NavigationProp, useNavigation } from "@react-navigation/native";

//socket io configurations
import config from "../../config";
import { io } from "socket.io-client";
import { IGetChat, useGetChat } from "../../api/Chat";
import { useSelector } from "react-redux";
import { IRootState } from "../../Redux";
const socket = io(config.host, {
  transports: ["websocket"],
});

const Index = () => {
  const ref = useRef<FlatList<IGetChat>>(null);
  const [reply, setReply] = useState<IGetChat>();
  const cancelReply = () => setReply(undefined);
  const addReply = (data: IGetChat) => {
    setReply(data);
  };

  const { id } = useSelector((state: IRootState) => state.Auth);

  const { _fetch, loading } = useGetChat();

  const [online, setOnline] = useState("0");
  const [writing, setWriting] = useState<string | null>(null);
  const [data, setData] = useState<IGetChat[]>([]);

  const updateChat = async (page: number) => {
    const { data, success } = await _fetch({ page });
    if (success) {
      setData(data);
    }
  };

  interface ISendChat {
    message: string;
    userId: number;
    replyId?: number;
    attachment?: string;
  }
  const sendChat = (props: ISendChat) => {
    socket.emit("chat", props);
  };

  useEffect(() => {
    socket.emit("join", { userId: id });
    //on online
    socket.on("online", (data: { online: string }) => {
      console.log("Socket::Online", data);
      setOnline(data.online);
    });

    //on writing
    socket.on("writing", (data: { msg: string }) => {
      console.log("Socket::Writing", data);
      setWriting(data.msg);
    });

    //socket on chat
    socket.on("chat", (data: IGetChat) => {
      console.log("Socket::Chat", data);
      setData((prev) => [data, ...prev]);
    });
    return () => {
      socket.emit("left", { userId: id });
    };
  }, []);

  useEffect(() => {
    updateChat(1);
  }, []);

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
    () => (
      <TextInput reply={reply} cancelReply={cancelReply} sendChat={sendChat} />
    ),
    [reply]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header online={online} writing={writing} />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {MemoizedFlatlist}
        {MemoizedTextInput}
      </View>
    </View>
  );
};

export default Index;
