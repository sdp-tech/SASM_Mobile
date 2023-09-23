import styled from "styled-components/native";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import FinishModal from "../../../common/FinishModal";
import { NextBtn } from "./PlaceForm";
import { TextPretendard as Text } from "../../../common/CustomText";

const Section = styled.View`
  height: 90%;
  width: 100%;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectWrapper = styled.View`
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const SelectItem = styled.TouchableOpacity<{
  selected: boolean;
}>`
  width: 48%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-vertical: 8px;
  background-color: ${(props) => (props.selected ? "#82DAA6" : "#FFFFFF")};
  border-radius: 12px;
  border-color: #82daa6;
  border-width: 1;
`;

interface TabProps {
  finish: () => void;
}

export default function PlaceAddinfoForm({ finish }: TabProps) {
  const [modal, setModal] = useState(false);
  const [selectedServ, setSelectedServ] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number[]>([]);

  const SERVICE_LIST = [
    { id: 0, name: "배달" },
    { id: 1, name: "방문접수" },
    { id: 2, name: "단체석" },
    { id: 3, name: "남/녀 화장실 구분" },
    { id: 4, name: "주차 가능" },
    { id: 5, name: "반려동물 동반" },
    { id: 6, name: "발렛파킹" },
    { id: 7, name: "예약" },
    { id: 8, name: "포장" },
    { id: 9, name: "장애인 편의시설" },
  ];
  const EVENT_LIST = [
    { id: 0, name: "용기 지참시 할인" },
    { id: 1, name: "SNS 업로드 할인" },
    { id: 2, name: "장바구니 지참시 할인" },
  ];

  function handlePress(
    target: number,
    selectedList: number[],
    setSelectedList: Dispatch<SetStateAction<number[]>>
  ) {
    if (selectedList.includes(target))
      setSelectedList(selectedList.filter((item) => item != target));
    else setSelectedList([...selectedList, target]);
  }

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        공간 이름
      </Text>
      <Text
        style={{
          ...TextStyles.labelSmall,
          width: "85%",
          textAlign: "left",
          marginTop: 15,
          marginBottom: 15,
        }}
      >
        제공 서비스
      </Text>
      <SelectWrapper>
        {SERVICE_LIST.map((item) => {
          const selected = selectedServ.includes(item.id);
          const color = selected ? "#ffffff" : "#202020";
          return (
            <SelectItem
              selected={selected}
              onPress={() =>
                handlePress(item.id, selectedServ, setSelectedServ)
              }
            >
              <Text
                style={{
                  ...TextStyles.labelSmall,
                  width: "100%",
                  textAlign: "center",
                  color: color,
                }}
              >
                {item.name}
              </Text>
            </SelectItem>
          );
        })}
      </SelectWrapper>

      <Text
        style={{
          ...TextStyles.labelSmall,
          width: "85%",
          textAlign: "left",
          marginTop: 40,
          marginBottom: 15,
        }}
      >
        이벤트
      </Text>
      <SelectWrapper>
        {EVENT_LIST.map((item) => {
          const selected = selectedEvent.includes(item.id);
          const color = selected ? "#ffffff" : "#202020";
          return (
            <SelectItem
              selected={selected}
              onPress={() =>
                handlePress(item.id, selectedEvent, setSelectedEvent)
              }
            >
              <Text
                style={{
                  ...TextStyles.labelSmall,
                  width: "100%",
                  textAlign: "center",
                  color: color,
                }}
              >
                {item.name}
              </Text>
            </SelectItem>
          );
        })}
      </SelectWrapper>
      <Modal visible={modal}>
        <FinishModal
          setModal={setModal}
          navigation={finish}
          title="제보 완료 !"
          subtitle={[
            "제보해주신 장소는",
            "SASM에서 검토한 후",
            "최종 등록됩니다",
          ]}
        />
      </Modal>
      <NextBtn
        onPress={() => {
          setModal(true);
        }}
        text="제보하기"
      />
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
