import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import DropDown from './DropDown';
import { TextPretendard as Text } from './CustomText';
import { useFocusEffect } from '@react-navigation/native';

interface DatePickerProps {
  //callback
  callback?: (e: dateProps) => void | Dispatch<SetStateAction<dateProps>>;
  //DropDown border
  isBorder?: boolean;
  label?: boolean;
  containerStyle?: ViewStyle;
  defaultDate?: string;
}

export interface dateProps {
  year: number;
  month: number;
  date: number;
}

export default function DatePicker({ callback, isBorder, label, containerStyle, defaultDate }: DatePickerProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear() - 99);
  const [month, setMonth] = useState<number>(1);
  const [date, setDate] = useState<number>(1);

  let yearArray = [];
  let monthArray = [];
  let dateArray = [];

  for (let i = new Date().getFullYear() - 99; i <= new Date().getFullYear(); i++) yearArray.push({ label: i, value: i })
  for (let i = 1; i <= 12; i++) monthArray.push({ label: i, value: i })
  for (let i = 1; i <= 31; i++) dateArray.push({ label: i, value: i })

  useEffect(()=>{
    if (defaultDate) {
      const [_y, _m, _d] = defaultDate.split('-');
      setYear(Number(_y));
      setMonth(Number(_m));
      setDate(Number(_d))
    }
  },[])

  useEffect(() => {
    if (callback) {
      callback({ year: year, month: month, date: date });
    }
  }, [year, month, date])

  return (
    <View style={{ ...containerStyle, height: 80, display: 'flex', alignItems: 'center' }}>
      {label &&
        <Text style={{ width: '85%', textAlign: 'left', fontSize: 14, lineHeight: 18, letterSpacing: -0.6 }}>
          생년월일
        </Text>
      }
      <View style={{ display: 'flex', width: '85%', flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-around' }}>
        <View style={{ width: '25%' }}>
          <DropDown
            items={yearArray}
            value={year}
            setValue={setYear}
            isBorder={isBorder} />
        </View>
        <View style={{ width: '20%' }}>
          <DropDown
            items={monthArray}
            value={month}
            setValue={setMonth}
            isBorder={isBorder} />
        </View>
        <View style={{ width: '20%' }}>
          <DropDown
            items={dateArray}
            value={date}
            setValue={setDate}
            isBorder={isBorder} />

        </View>
      </View>
    </View>
  )
}
