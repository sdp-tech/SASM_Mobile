import styled from "styled-components/native";
import {
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";
import { TextPretendard as Text } from "../../../common/CustomText";

const Section = styled.View`
  height: 90%;
  width: 100%;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategoryWrapper = styled.TouchableOpacity<{
  selected: boolean;
}>`
  height: 30px;
  width: 70px;
  margin: 8px;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#67D393" : "#FFFFFF")};
  padding: 5px 10px;
  border-radius: 12px;
  border: 1px solid #67d393;
`;

const TextWrapper = styled.View`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

interface ListProps {
  id: number;
  name: string;
  selected: boolean;
}

interface TabProps {
  NextBtn: any;
}

export default function PlaceProfileScreen({ NextBtn }: TabProps) {
  const DAY_LIST: ListProps[] = [
    { id: 0, name: "공휴일", selected: false },
    { id: 1, name: "월요일", selected: false },
    { id: 2, name: "화요일", selected: false },
    { id: 3, name: "수요일", selected: false },
    { id: 4, name: "목요일", selected: false },
    { id: 5, name: "금요일", selected: false },
    { id: 6, name: "토요일", selected: false },
    { id: 0, name: "일요일", selected: false },
  ];
  const [selectedDay, setSelectedDay] = useState(DAY_LIST);

  function handleSelect(targetId: number) {
    setSelectedDay((prev) => {
      const newSelectedDay = prev.map((item) => {
        if (item.id === targetId) {
          return { ...item, selected: !item.selected };
        } else {
          return item;
        }
      });
      return newSelectedDay;
    });
  }

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        공간 이름
      </Text>
      <Text style={{ ...TextStyles.label, marginTop: 50, marginBottom: 40 }}>
        언제 열리는 장소인가요?
      </Text>
      <Text
        style={{
          ...TextStyles.labelSmall,
          alignSelf: "flex-start",
        }}
      >
        휴무일
      </Text>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 15, marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        data={selectedDay}
        horizontal
        renderItem={({ item }) => {
          return (
            <CategoryWrapper
              selected={item.selected}
              onPress={() => handleSelect(item.id)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: item.selected ? "#FFFFFF" : "#000000",
                  marginHorizontal: 5,
                }}
              >
                {item.name}
              </Text>
            </CategoryWrapper>
          );
        }}
      />
      <Text
        style={{
          ...TextStyles.labelSmall,
          alignSelf: "flex-start",
        }}
      >
        영업시간
      </Text>
      <TextWrapper>
        <Text
          style={{
            ...TextStyles.labelSmall,
            alignSelf: "flex-start",
          }}
        >
          브레이크타임
        </Text>
      </TextWrapper>
      {NextBtn}
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 24,
    letterSpacing: -0.6,
  },
  labelSmall: {
    fontSize: 14,
    letterSpacing: -0.6,
    marginLeft: 23,
  },
  labelBold: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "700",
    width: "85%",
    alignSelf: "center",
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  submit: {
    fontSize: 24,
    lineHeight: 35,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  serviceSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
