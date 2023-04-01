import React, { Dispatch, SetStateAction, useState } from 'react';
import { Text, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
const SearchWrapper = styled.View`
  display: flex;
  width: 80%;
  margin: 0 auto;
  height: 40px;
  flex-direction: row;
  margin-bottom: 10px;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`
const StyledInput = styled.TextInput`
  width: 85%;
  padding: 0 5%;
`
const ResetButton = styled.TouchableOpacity`
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
        <Text>X</Text>
      </ResetButton>
    </SearchWrapper >
  )
}
