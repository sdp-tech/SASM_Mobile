import React, { Dispatch, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import Close from "../../../assets/img/common/Close.svg";
import styled from 'styled-components/native';
import PlaceFormUser from './PlaceFormUser';
import PlaceFormOwner from './PlaceFormOwner';
import PlaceUser from "../../../assets/img/Map/PlaceUser.svg";
import { Request } from '../../../common/requests';
import Popup from '../../../common/Popup';
import FormHeader from '../../../common/FormHeader';

export const HeaderPlaceForm = styled.View<{ color: string }>`
  background-color: ${props => props.color};
  height: 12.5%;
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  flex-flow: row;
`
const Section = styled.View`
  height: 87.5%;
  display: flex;
  align-items: center;
`
const Link = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  background-color: #67D393;
  margin-vertical: 10px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
`
const MenuWrapper = styled.View`
  width: 85%;
  margin: 40% auto;
  height: 40%;
  display: flex;
  justify-content: space-around;
`
interface PlaceFormProps {
  setPlaceformModal: Dispatch<SetStateAction<boolean>>;
}

export interface SNSListProps {
  id: number;
  name: string;
  key: number;
}

export default function PlaceForm({ setPlaceformModal }: PlaceFormProps): JSX.Element {
  const [tab, setTab] = useState<number>(0);
  const [snsList, setSNSList] = useState<SNSListProps[]>([]);
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const request = new Request();

  const getSNSList = async () => {
    const response_sns_list = await request.get('/places/sns_types/');
    setSNSList([...response_sns_list.data.data.results.filter((el: SNSListProps) => el.name != ''), { id: 0, name: '기타' }]);
  }

  useEffect(() => {
    getSNSList();
  }, [])

  return (
    <View>
      <HeaderPlaceForm color={tab == 1 ? '#67D393' : '#FFFFFF'}>
        <Text style={{ ...TextStyles.Link, fontSize: 24 }}>장소 제보하기</Text>
        <TouchableOpacity onPress={() => { tab == 0 ? setPlaceformModal(false) : setClosePopup(true) }}>
          <Close color={tab == 1 ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
      </HeaderPlaceForm>
      <Section>
        {
          {
            0:
              <MenuWrapper>
                <View>
                  <Text style={TextStyles.title}>SASM에 없는</Text>
                  <Text style={TextStyles.title}>장소를 제보해주세요</Text>
                </View>
                <Link onPress={() => { setTab(1) }}>
                  <Text style={{...TextStyles.title, color:'#FFFFFF', marginLeft:0 }}>이미지로 제보하기</Text>
                  <PlaceUser />
                </Link>
                {/* <Link onPress={() => { setTab(2) }}>
                  <Text style={TextStyles.Link}>사업주입니다!</Text>
                  <PlaceUser />
                </Link> */}
              </MenuWrapper>
            ,
            1: <PlaceFormUser snsType={snsList} setPlaceformModal={setPlaceformModal} />,
            // 2: <PlaceFormOwner setPlaceformModal={setPlaceformModal} />
          }[tab]
        }

      </Section>
      <Popup visible={closePopup} setVisible={setClosePopup} setModal={setPlaceformModal} />
    </View >
  )
}

const TextStyles = StyleSheet.create({
  Link: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "700",
    lineHeight: 35
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#000000',
    letterSpacing:-0.6,
    marginLeft: 25
  }
})
