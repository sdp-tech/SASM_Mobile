import React, { Dispatch, ReactElement, ReactNode, SetStateAction, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Close from "../../../assets/img/common/Close.svg";
import styled from 'styled-components/native';
import PlaceFormUser from './PlaceFormUser';
import PlaceFormOwner from './PlaceFormOwner';
import PlaceUser from "../../../assets/img/Map/PlaceUser.svg";

const Header = styled.View<{ color: string }>`
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
  padding-horizontal: 35px;
  display: flex;
  justify-content: center;
`
const Link = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  background-color: #75E59B;
  margin-vertical: 10px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

`
interface PlaceFormProps {
  setPlaceformModal: Dispatch<SetStateAction<boolean>>;
}

export default function PlaceForm({ setPlaceformModal }: PlaceFormProps): JSX.Element {
  const [tab, setTab] = useState<number>(0);
  return (
    <View>
      <Header color={tab==1?'#75E59B':'#FFFFFF'}>
        <Text style={{...TextStyles.Link, fontSize:24}}>장소 제보하기</Text>
        <TouchableOpacity onPress={() => { setPlaceformModal(false) }}>
          <Close color={tab==1?'#FFFFFF':'#000000'} />
        </TouchableOpacity>
      </Header>
      <Section>
        {
          {
            0:
              <>
                <Text style={TextStyles.title}>SASM에 없는</Text>
                <Text style={TextStyles.title}>장소를 제보해주세요</Text>
                <Link onPress={() => { setTab(1) }}>
                  <Text style={TextStyles.Link}>이미지로 제보하기</Text>
                  <PlaceUser/>
                </Link>
                <Link onPress={() => { setTab(2) }}>
                  <Text style={TextStyles.Link}>사업주입니다!</Text>
                  <PlaceUser/>
                </Link>
              </>
            ,
            1: <PlaceFormUser setPlaceformModal={setPlaceformModal}/>,
            2: <PlaceFormOwner setPlaceformModal={setPlaceformModal}/>
          }[tab]
        }

      </Section>
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
    fontSize: 24,
    fontWeight:'700',
    lineHeight: 35,
    color:'#000000',
  }
})
