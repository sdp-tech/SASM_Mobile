import React, { useState, useEffect, useCallback, useContext, memo } from "react";
import { View, useWindowDimensions } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchResult from "./SearchResult";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

interface SearchResultTabViewProps {
  // search: string;
  data: any[];
  count: any;
  onRefresh: any;
  refreshing: boolean;
}

function SearchResultTabView({
  data,
  // search,
  count,
  onRefresh,
  refreshing,
}: SearchResultTabViewProps) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: "curation", title: "큐레이션" },
    { key: "story", title: "스토리" },
    { key: "forest", title: "포레스트" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "curation":
        return (
          <SearchResult
            type={route.key}
            count={count.curation}
            data={data.filter((item) => item.model === "Curation")}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      case "story":
        return (
          <SearchResult
            type={route.key}
            count={count.story}
            data={data.filter((item) => item.model === "Story")}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      case "forest":
        return (
          <SearchResult
            type={route.key}
            count={count.forest}
            data={data.filter((item) => item.model === "Forest")}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorContainerStyle={{
            borderBottomColor: "#848484",
            borderBottomWidth: 0.25,
          }}
          indicatorStyle={{
            backgroundColor: "#67D393",
          }}
          style={{
            marginTop: 10,
            backgroundColor: "white",
            shadowOffset: { height: 0, width: 0 },
            shadowColor: "transparent",
          }}
          renderLabel={({ route, focused, color }) => {
            return (
              <View>
                <Text
                  style={{
                    color: focused ? "#202020" : "#848484",
                    fontWeight: focused ? 600 : 400,
                    fontSize: 14,
                    letterSpacing: -0.6,
                  }}
                >
                  {route.title}
                </Text>
              </View>
            );
          }}
          pressColor={"transparent"}
        />
      )}
    />
  );
}

export default memo(SearchResultTabView);