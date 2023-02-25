import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
const SearchWrapper = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`
const StyledInput = styled.TextInput`
  border: 1px black solid;
  width: 180px;
  height: 25px;
  background-color: #FFFFFF;
`
const SubmitButton = styled.TouchableOpacity`
  border: 1px black solid;
`
interface SearchBarProps {
  setSearch: (search: string) => void;
}
export default function SearchBar({ setSearch }: SearchBarProps) {
  const [tempSearch, setTempSearch] = useState('');
  return (
    <SearchWrapper>
      <StyledInput
        onChangeText={(text) => { setTempSearch(text) }}
      />
      <SubmitButton onPress={()=>{setSearch(tempSearch)}}>
        <Text>검색</Text>
      </SubmitButton>
    </SearchWrapper>
  )
}
