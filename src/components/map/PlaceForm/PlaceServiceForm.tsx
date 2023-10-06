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
import { Dispatch, SetStateAction, useState, useRef } from "react";
import ModalSelector from "react-native-modal-selector";
import { Request } from "../../../common/requests";
import FinishModal from "../../../common/FinishModal";
import { NextBtn } from "./PlaceForm";
import { formDataProps } from "./PlaceForm";
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
  formData: formDataProps;
  setFormData: React.Dispatch<React.SetStateAction<formDataProps>>;
}

export default function PlaceServiceForm({
  finish,
  formData,
  setFormData,
}: TabProps) {
  const [modal, setModal] = useState(false);
  const [veganModal, setVeganModal] = useState(false);
  const selectorVeganRef = useRef<ModalSelector>(null);
  const request = new Request();

  const vegan_category = [
    { type: "비건", key: 0 },
    { type: "락토", key: 1 },
    { type: "오보", key: 2 },
    { type: "페스코", key: 3 },
    { type: "폴로", key: 4 },
    { type: "그 외", key: 5 },
    { type: "없음", key: 6 },
  ];

  async function handleSubmit() {
    const form = new FormData();
    for (let i of Object.keys(formData)) {
      if (i == "snsList") continue;
      form.append(`${i}`, `${formData[i]}`);
    }
    const response = await request.post("/places/create/", formData, {
      "Content-Type": "multipart/form-data",
    });
  }

  return (
    <Section>
      <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
        {formData.place_name}
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
        <SelectItem
          selected={formData.vegan_category !== null}
          onPress={() => {
            if (selectorVeganRef.current) selectorVeganRef.current.open();
          }}
        >
          <Text
            style={{
              ...TextStyles.labelSmall,
              width: "100%",
              textAlign: "center",
              color: formData.vegan_category !== null ? "#ffffff" : "#202020",
            }}
          >
            {formData.vegan_category !== null
              ? `비건 메뉴: ${formData.vegan_category}`
              : "비건 메뉴"}
          </Text>
        </SelectItem>

        <SelectItem
          selected={formData.pet_category === true}
          onPress={() =>
            setFormData((prev) => {
              return { ...prev, pet_category: !prev.pet_category };
            })
          }
        >
          <Text
            style={{
              ...TextStyles.labelSmall,
              width: "100%",
              textAlign: "center",
              color: formData.pet_category === true ? "#ffffff" : "#202020",
            }}
          >
            반려동물 동반
          </Text>
        </SelectItem>
        <SelectItem
          selected={formData.reusable_con_category === true}
          onPress={() =>
            setFormData((prev) => {
              return {
                ...prev,
                reusable_con_category: !prev.reusable_con_category,
              };
            })
          }
        >
          <Text
            style={{
              ...TextStyles.labelSmall,
              width: "100%",
              textAlign: "center",
              color:
                formData.reusable_con_category === true ? "#ffffff" : "#202020",
            }}
          >
            용기내 가능
          </Text>
        </SelectItem>
        <SelectItem
          selected={formData.tumblur_category === true}
          onPress={() =>
            setFormData((prev) => {
              return { ...prev, tumblur_category: !prev.tumblur_category };
            })
          }
        >
          <Text
            style={{
              ...TextStyles.labelSmall,
              width: "100%",
              textAlign: "center",
              color: formData.tumblur_category === true ? "#ffffff" : "#202020",
            }}
          >
            텀블러 지참시 할인
          </Text>
        </SelectItem>
      </SelectWrapper>
      <ModalSelector
        ref={selectorVeganRef}
        labelExtractor={(item) => item.type}
        data={vegan_category}
        cancelText="취소"
        cancelTextStyle={{ fontSize: 14 }}
        cancelContainerStyle={{ width: 300, alignSelf: "center" }}
        optionContainerStyle={{ width: 300, alignSelf: "center" }}
        optionTextStyle={{ color: "#000000", fontSize: 14 }}
        selectStyle={{ display: "none" }}
        onChange={(option) => {
          setFormData(() => {
            return {
              ...formData,
              vegan_category: option.type === "없음" ? null : option.type,
            };
          });
        }}
      />

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
          handleSubmit();
          setModal(true);
        }}
        text="제보 완료"
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
