import { View, FlatList, TouchableOpacity } from "react-native";
import { useRef, useContext } from "react";
import { TextPretendard as Text } from "../../../common/CustomText";
import Arrow from "../../../assets/img/common/Arrow.svg";
import CurationCard from "./SearchCurationCard";
import StoryCard from "./SearchStoryCard";
import ForestCard from "./SearchForestCard";
import { LoginContext } from "../../../common/Context";

interface SearchListProps {
  info: any;
  onEndReached?: any;
  onRefresh?: any;
  refreshing?: boolean;
  type: "curation" | "story" | "forest";
}

export default function SearchList({
  info,
  onEndReached,
  onRefresh,
  refreshing,
  type,
}: SearchListProps) {
  const { isLogin, setLogin } = useContext(LoginContext);
  const scrollRef = useRef<FlatList>(null);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
      console.log("작동함");
    }
  };

  return (
    <FlatList
      ref={scrollRef}
      data={info}
      numColumns={type == "curation" ? 3 : 1}
      renderItem={({ item }) => {
        switch (type) {
          case "curation":
            return <CurationCard data={item} />;
          case "story":
            return <StoryCard data={item} />;
          case "forest":
            return <ForestCard data={item} />;
          default:
            return <></>;
        }
      }}
      keyExtractor={(item, index) => String(index)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      ListFooterComponent={
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={scrollToTop}
            style={{ flexDirection: "row" }}
          >
            <Arrow
              width={18}
              height={18}
              transform={[{ rotate: "270deg" }]}
              color={"#666666"}
            />
            <Text
              style={{
                color: "#666666",
                fontWeight: "600",
                marginTop: 4,
                marginLeft: 10,
              }}
            >
              맨 위로 이동
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}
