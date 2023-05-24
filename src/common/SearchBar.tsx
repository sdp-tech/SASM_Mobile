import React, { Dispatch, SetStateAction, useState } from 'react';
import { Text, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Search from "../assets/img/common/Search.svg";
const SearchWrapper = styled.View`
  display: flex;
  width: 80%;
  margin: 0 auto;
  height: 35px;
  flex-direction: row;
  border-radius: 20px;
`
const StyledInput = styled.TextInput`
  width: 100%;
  padding: 0 5%;
`
const ResetButton = styled.TouchableOpacity`
  position: absolute;
  height: 35px;
  right: 0;
  top: 0;
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
`
interface SearchBarProps extends TextInputProps {
  search: string;
  style: TextStyle;
  setPage: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
}
export default function SearchBar({ style, search, setSearch, setPage, ...rest }: SearchBarProps) {
  return (
    <SearchWrapper
      style={style}
    >
      <StyledInput
        value={search}
        spellCheck={false}
        onChangeText={(text: string) => { setSearch(text); setPage(1); }}
        {...rest}
      />
      <ResetButton onPress={() => setSearch("")}>
        <Search/>
      </ResetButton>
    </SearchWrapper >
  )
}
