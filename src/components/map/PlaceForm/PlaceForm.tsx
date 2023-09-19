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
import PlaceFormUser from "./PlaceFormUser";
import PlaceFormOwner from "./PlaceFormOwner";
import PlaceUser from "../../../assets/img/Map/PlaceUser.svg";
import { Request } from "../../../common/requests";
import Popup from "../../../common/Popup";
import PlaceFormHeader from "./PlaceFormHeader";
import PlaceProfileForm from "./PlaceProfileForm";
import PlaceImageForm from "./PlaceImageForm";
import PlaceTimeForm from "./PlaceTimeForm";
import PlaceOwnerForm from "./PlaceOwnerForm";
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
  margin-vertical: 10px;
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

export interface SNSListProps {
  id: number;
  name: string;
  key: number;
}

interface NextBtnProps {
  setTab: Dispatch<SetStateAction<number>>;
}

function NextBtn({ setTab }: NextBtnProps) {
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
      onPress={() => setTab((prevTab) => prevTab + 1)}
    >
      <Text
        style={{
          ...TextStyles.Link,
          textAlign: "center",
          fontWeight: "400",
          margin: 0,
        }}
      >
        다음
      </Text>
    </TouchableOpacity>
  );
}

export default function PlaceForm({
  setPlaceformModal,
}: PlaceFormProps): JSX.Element {
  const [tab, setTab] = useState<number>(0);
  const [snsList, setSNSList] = useState<SNSListProps[]>([]);
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const request = new Request();
  const navigation = useNavigation();

  const getSNSList = async () => {
    const response_sns_list = await request.get("/places/sns_types/");
    setSNSList([
      ...response_sns_list.data.data.results.filter(
        (el: SNSListProps) => el.name != ""
      ),
      { id: 0, name: "기타" },
    ]);
  };

  useEffect(() => {
    getSNSList();
  }, []);

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
            tab == 0 ? setPlaceformModal(false) : setClosePopup(true);
          }}
        >
          <Close style={{ top: "60%", margin: "8%" }} color="#000000" />
        </TouchableOpacity>
      ) : (
        <PlaceFormHeader
          onLeft={() => setTab((prevTab) => prevTab - 1)}
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
              <Link
                onPress={() => {
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
              </Link>
            </MenuWrapper>
          ),
          1: <PlaceOwnerForm NextBtn={<NextBtn setTab={setTab} />} />,
          2: <PlaceProfileForm NextBtn={<NextBtn setTab={setTab} />} />,
          3: <PlaceImageForm NextBtn={<NextBtn setTab={setTab} />} />,
          4: <PlaceTimeForm NextBtn={<NextBtn setTab={setTab} />} />,
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
