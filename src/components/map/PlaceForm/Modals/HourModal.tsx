import React, { Dispatch, SetStateAction } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled from 'styled-components/native';
import { HeaderPlaceForm } from '../PlaceForm';
import Close from "../../../../assets/img/common/Close.svg";
import { PlaceFormProps, open_hours } from '../PlaceFormUser';

const Section = styled.View`
  height: 87.5%;
  display: flex;
  flex-direction: row;
`
const SectionHalf = styled.View`
  height: 100%;
  width: 50%;
  padding-vertical: 40px;
`
interface HourModalProps {
  setHourModal: Dispatch<SetStateAction<boolean>>;
  form: PlaceFormProps;
  setForm: Dispatch<SetStateAction<PlaceFormProps>>;

}

export default function HourModal({setHourModal, form, setForm}:HourModalProps) {

  return (
    <View style={{ height: '100%' }}>
          <HeaderPlaceForm color='#75E59B'>
            <Text style={TextStyles.header}>영업시간</Text>
            <TouchableOpacity onPress={() => { setHourModal(false) }}>
              <Close color={'#FFFFFF'} />
            </TouchableOpacity>
          </HeaderPlaceForm>
          <Section>
            <SectionHalf>
              <Text style={TextStyles.hourtitle}>영업시간</Text>
              {
                open_hours.map((data) =>
                  <View style={{ display: "flex", flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Text style={TextStyles.hour}>{data.day}</Text>
                    <TextInput style={{ width: '75%', height: 45, textAlign: 'center' }}
                      onChangeText={(e) => { setForm({ ...form, [data.name]: e }) }}
                      placeholder='00:00 ~ 00:00' value={form[data.name]}
                    />
                  </View>
                )
              }
            </SectionHalf>
            <SectionHalf>
              <Text style={TextStyles.hourtitle}>브레이크타임</Text>
              <TextInput style={{ width: '100%', height: 45, textAlign: 'center', marginVertical: 10 }}
                onChangeText={(e) => { setForm({ ...form, etc_hours: e }) }}
                inputMode='numeric'
                placeholder='00:00 ~ 00:00' />
            </SectionHalf>
          </Section>
        </View>
  )
}

const TextStyles = StyleSheet.create({
  hourtitle: {
    fontWeight: "700",
    textAlign: 'center',
  },
  hour: {
    fontSize: 16,
    width: '25%',
    textAlign: 'center'
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: "700"
  },
})