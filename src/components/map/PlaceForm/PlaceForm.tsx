import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Close from "../../../assets/img/common/Close.svg";
import styled from "styled-components/native";
import PlaceUser from "../../../assets/img/Map/PlaceUser.svg";
import { Request } from "../../../common/requests";
import Popup from "../../../common/Popup";
import PlaceFormHeader from "./PlaceFormHeader";
import PlaceProfileForm from "./PlaceProfileForm";
import PlaceImageForm from "./PlaceImageForm";
import PlaceTimeForm from "./PlaceTimeForm";
import PlaceOwnerForm from "./PlaceOwnerForm";
import PlaceAddinfoForm from "./PlaceAddinfoForm";
import PlaceServiceForm from "./PlaceServiceForm";
import { useNavigation } from "@react-navigation/native";

export const HeaderPlaceForm = styled.View<{ color: string }>`
  background-color: ${(props) => props.color};
  height: 10%;
  display: flex;
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
  align-items: flex-start;
  flex-flow: row;
`;
const Section = styled.View`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;
const Link = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  background-color: #67d393;
  margin-vertical: 50px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
`;
const MenuWrapper = styled.View`
  width: 85%;
  margin: auto;
  height: 60%;
  display: flex;
  flex-flow: column;
`;
interface PlaceFormProps {
  setPlaceformModal: Dispatch<SetStateAction<boolean>>;
}

interface NextBtnProps {
  onPress: () => void;
  text?: string;
}
export interface formDataProps {
  place_name: string;
  category: string;
  vegan_category: string | null;
  tumblur_category: boolean | null;
  reusable_con_category: boolean | null;
  pet_category: boolean | null;
  mon_hours: string;
  tues_hours: string;
  wed_hours: string;
  thurs_hours: string;
  fri_hours: string;
  sat_hours: string;
  sun_hours: string;
  etc_hours: string;
  place_review: string;
  address: string;
  short_cur: string;
  phone_num: string;
  imageList: string[] | null;
  snsList: string[] | null;
}

export function NextBtn({ onPress, text = "다음" }: NextBtnProps) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#67d393",
        marginTop: "auto",
        width: "45%",
        height: 45,
        borderRadius: 10,
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Text
        style={{
          ...TextStyles.Link,
          textAlign: "center",
          fontWeight: "400",
          margin: 0,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default function PlaceForm({
  setPlaceformModal,
}: PlaceFormProps): JSX.Element {
  const [owner, setOwner] = useState(false);

  const [tab, setTab] = useState<number>(0);
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const [formData, setFormData] = useState<formDataProps>({
    place_name: "",
    category: "",
    vegan_category: null,
    tumblur_category: null,
    reusable_con_category: null,
    pet_category: null,
    mon_hours: "",
    tues_hours: "",
    wed_hours: "",
    thurs_hours: "",
    fri_hours: "",
    sat_hours: "",
    sun_hours: "",
    etc_hours: "",
    place_review: "",
    address: "",
    short_cur: "",
    phone_num: "",
    imageList: null,
    snsList: null,
  });

  useEffect(() => {
    if (closePopup) {
      Alert.alert("나가시겠습니까?", "입력하신 정보는 저장되지 않습니다.", [
        {
          text: "머무르기",
          style: "cancel",
          onPress: () => setClosePopup(false),
        },
        {
          text: "나가기",
          style: "destructive",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => setPlaceformModal(false),
        },
      ]);
    }
  }, [closePopup]);

  return (
    <Section>
      {tab == 0 ? (
        <TouchableOpacity
          onPress={() => {
            setPlaceformModal(false);
          }}
        >
          <Close style={{ top: "60%", margin: "8%" }} color="#000000" />
        </TouchableOpacity>
      ) : (
        <PlaceFormHeader
          onLeft={() =>
            setTab((prevTab) => {
              if (prevTab == 2 && !owner) return 0;
              else return prevTab - 1;
            })
          }
          onRight={() => setClosePopup(true)}
        />
      )}

      {
        {
          0: (
            <MenuWrapper>
              <View>
                <Text style={TextStyles.title}>SASM에 없는</Text>
                <Text style={TextStyles.title}>장소를 제보해주세요</Text>
              </View>
              <Text style={TextStyles.content}>건당 ---P 지급해드려요</Text>
              <Link
                onPress={() => {
                  setOwner(false);
                  setTab(2);
                }}
              >
                <Text
                  style={{
                    ...TextStyles.title,
                    color: "#FFFFFF",
                    marginLeft: 0,
                  }}
                >
                  이미지로 제보하기
                </Text>
                <PlaceUser />
              </Link>
              {/* <Link
                onPress={() => {
                  setOwner(true);
                  setTab(1);
                }}
              >
                <Text
                  style={{
                    ...TextStyles.title,
                    color: "#FFFFFF",
                    marginLeft: 0,
                  }}
                >
                  사업주입니다!
                </Text>
                <PlaceUser />
              </Link> */}
            </MenuWrapper>
          ),
          1: (
            <PlaceOwnerForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                />
              }
            />
          ),
          2: (
            <PlaceProfileForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                />
              }
              formData={formData}
              setFormData={setFormData}
            />
          ),
          3: (
            <PlaceImageForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                />
              }
            />
          ),
          4: (
            <PlaceTimeForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                />
              }
            />
          ),
          5: (
            <PlaceAddinfoForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                />
              }
              formData={formData}
              setFormData={setFormData}
            />
          ),
          6: <PlaceServiceForm finish={() => setPlaceformModal(false)} />,
        }[tab]
      }
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  Link: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 35,
  },
  content: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    marginTop: 15,
    marginBottom: 25,
    marginLeft: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    color: "#000000",
    letterSpacing: -0.6,
    marginLeft: 25,
  },
});
