import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TouchableOpacity } from "react-native";
import SearchBar from '../../../../common/SearchBar';
import { TextPretendard as Text } from '../../../../common/CustomText';
import Category from '../../../../common/Category';
import Search from "../../../../assets/img/common/Search.svg";
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import styled from 'styled-components/native';

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5px;
  margin-bottom: 10px;
`
const Section = styled.View`
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
interface SearchNCategoryProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  checkedList: string[];
  setCheckedList: Dispatch<SetStateAction<string[]>>;
  label: string;
  type: boolean;
  setType: Dispatch<SetStateAction<boolean>>;
  setPage?:Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  edit: boolean;
}

export function SearchNCategory({ setSearch, search, checkedList, setCheckedList, label, setType, type, setPage, setEdit, edit}: SearchNCategoryProps) {
  const [mode, setMode] = useState<boolean>(true);

  return (
    <Container>
      <Section>
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setMode(true) }}>
          <Search width={18} height={18} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setMode(false) }}>
          <Menu width={18} height={18} />
        </TouchableOpacity>
      </Section>
      <Section>
        {
          mode ?
            <>
              <SearchBar
                setPage={setPage}
                search={search}
                setSearch={setSearch}
                style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, width: 280, zIndex: 1 }}
                placeholder="내용 입력 전"
                placeholderTextColor={"#848484"}
              />
              <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
              onPress={()=>{setEdit(!edit)}}>
                <Text style={{ fontSize: 12 }}>편집</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                onPress={() => { setType(!type); if(setPage) setPage(1) }}>
                <Text style={{ fontSize: 12 }}>{label}</Text>
              </TouchableOpacity>
            </>
            :
            <Category setPage={setPage} checkedList={checkedList} setCheckedList={setCheckedList} story={true} style={{ marginVertical: 0 }} />
        }
      </Section>
    </Container>
  )
}

interface SearchNoCategoryProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  type: boolean;
  setType: Dispatch<SetStateAction<boolean>>;
  label: string;
  setPage?: Dispatch<SetStateAction<number>>;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

export function SearchNoCategory({ setSearch, search, type, setType, label, setPage, setEdit, edit }: SearchNoCategoryProps) {
  const [mode, setMode] = useState<boolean>(true);

  return (
    <Container>
      <Section>
        {
          mode ?
            <>
              <SearchBar
              setPage={setPage}
                search={search}
                setSearch={setSearch}
                style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, zIndex: 1 }}
                placeholder="내용 입력 전"
                placeholderTextColor={"#848484"}
              />
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setMode(false); }}>
                <Menu width={18} height={18} />
              </TouchableOpacity></>
            :
            <>
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setMode(true); }}>
                <Search width={18} height={18} />
              </TouchableOpacity>
              <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                onPress={()=>{setEdit(!edit)}}>
                <Text style={{ fontSize: 12 }}>편집</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                onPress={() => { setType(!type) }}>
                <Text style={{ fontSize: 12 }}>{label}</Text>
              </TouchableOpacity>
            </>
        }

      </Section>
    </Container>
  )
}
