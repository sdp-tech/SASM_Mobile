import styled from "styled-components/native";
import {
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { formDataProps, ListProps } from "./PlaceForm";
import CheckboxImg from "../../../assets/img/common/CheckBox.svg";
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

const InputWrapper = styled.View`
  height: 60px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: flex-start;
`;

const Input = styled.TextInput`
  width: 40%;
  font-size: 16px;
  margin-left: 25px;
  letter-spacing: 1;

  /* border: 1px solid black; */
`;

const CheckboxWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 25px;
  height: 20px;
  width: 45px;
`;

interface InputProps {
  day: string;
  value: string | null;
  onChangeText: (text: string) => void;
}

interface CheckboxProps {
  name: string;
  checked: boolean;
  onPress: () => void;
}

interface TabProps {
  NextBtn: any;
  selectedDay: ListProps[];
  setSelectedDay: React.Dispatch<React.SetStateAction<ListProps[]>>;
  formData: formDataProps;
  setFormData: React.Dispatch<React.SetStateAction<formDataProps>>;
}

function TimeInput({ day, value, onChangeText }: InputProps) {
  return (
    <InputWrapper>
      <Text
        style={{
          ...TextStyles.label,
          marginTop: 0,
          marginLeft: 23,
          textAlign: "left",
          width: 70,
        }}
      >
        {day}
      </Text>
      {value !== null && (
        <Input
          placeholderTextColor={"#848484"}
          placeholder="9:00 - 20:00"
          inputMode="numeric"
          value={value}
          onChangeText={onChangeText}
        />
      )}
    </InputWrapper>
  );
}

function CheckBox({ name, checked, onPress }: CheckboxProps) {
  return (
    <CheckboxWrapper>
      <Text style={{ ...TextStyles.label, marginTop: 0, lineHeight: 20 }}>
        {name}
      </Text>
      {checked ? (
        <CheckboxImg style={{ width: 16, height: 16 }} />
      ) : (
        <TouchableOpacity
          style={{
            width: 16,
            height: 16,
            borderWidth: 1,
            borderColor: "#848484",
            borderRadius: 100,
          }}
          onPress={onPress}
        ></TouchableOpacity>
      )}
    </CheckboxWrapper>
  );
}

export default function PlaceTimeForm({
  NextBtn,
  selectedDay,
  setSelectedDay,
  formData,
  setFormData,
}: TabProps) {
  const [breaktime, setBreaktime] = useState(formData.etc_hours !== "");

  function handleSelect(targetId: number) {
    setSelectedDay((prev) => {
      const newSelectedDay = prev.map((item) => {
        if (item.id === targetId) {
          const timeData = item.selected ? "" : "휴무";
          setFormData((prev) => {
            return { ...prev, [item.data]: timeData };
          });
          return { ...item, selected: !item.selected };
        } else {
          return item;
        }
      });
      return newSelectedDay;
    });
  }

  function handleChange(item: ListProps, newVal: string) {
    setFormData((prev) => {
      return { ...prev, [item.data]: newVal };
    });
    if (item.id < 6) {
      setFormData((prev) => {
        return { ...prev, week_hours: newVal };
      });
      selectedDay.map((day) => {
        if (!day.selected && day.id > 0 && day.id < 6) {
          if (formData[day.data] !== newVal) {
            setFormData((prev) => {
              return { ...prev, week_hours: null };
            });
          }
        }
      });
    }
  }

  function handleWeekdayChange(newVal: string) {
    selectedDay.map((item) => {
      if (!item.selected && item.id < 6) {
        setFormData((prev) => {
          return { ...prev, [item.data]: newVal };
        });
      }
    });
  }

  return (
    <Section>
      <ScrollView
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text style={{ ...TextStyles.label, marginTop: 30, fontWeight: 700 }}>
          {formData.place_name}
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
          contentContainerStyle={{ paddingHorizontal: 15, marginVertical: 10 }}
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
            marginVertical: 30,
            alignSelf: "flex-start",
          }}
        >
          영업시간
        </Text>
        {/* <TimeInput
          day="평일"
          value={formData["week_hours"]}
          onChangeText={(e) => {
            handleWeekdayChange(e);
          }}
        /> */}
        {selectedDay.map(
          (item) =>
            !item.selected &&
            item.id > 0 && (
              <TimeInput
                day={item.name}
                value={formData[item.data]}
                onChangeText={(e) => {
                  handleChange(item, e);
                }}
              />
            )
        )}
        <InputWrapper style={{ marginVertical: 20 }}>
          <Text
            style={{ ...TextStyles.labelSmall, textAlign: "left", width: 70 }}
          >
            브레이크타임
          </Text>
          {breaktime ? (
            <Input
              placeholderTextColor={"#848484"}
              placeholder="15:00 - 17:00"
              inputMode="numeric"
              value={formData.etc_hours}
              onChangeText={(e) =>
                setFormData((prev) => {
                  return { ...prev, etc_hours: e };
                })
              }
            />
          ) : (
            <CheckBox
              name="유"
              checked={breaktime}
              onPress={() => setBreaktime(true)}
            />
          )}
          <CheckBox
            name="무"
            checked={!breaktime}
            onPress={() => {
              setFormData((prev) => {
                return { ...prev, etc_hours: "" };
              });
              setBreaktime(false);
            }}
          />
        </InputWrapper>
        {NextBtn}
      </ScrollView>
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
