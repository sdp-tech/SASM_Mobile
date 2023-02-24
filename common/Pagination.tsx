import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const Section = styled.View`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justity-content: center;
`

const Button = styled.TouchableOpacity`
  border-radius: 8px;
  padding: 8px;
`;
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
`

type PaginationProps = {
  total: number;
  page: number;
  setPage: (page: number) => void;
  limit: number;
}

export default function Pagination({ total, page, setPage, limit }: PaginationProps): JSX.Element {
  const numPages: number = Math.ceil(total / limit);
  let Pages: number[] = [];
  for (let i = 1; i <= numPages; i++) {
    Pages.push(i);
  }
  return (
    <Section>
      <Button onPress={() => setPage(page - 1)} disabled={page === 1}>
        <ButtonText>&lt;</ButtonText>
      </Button>
      {
        Pages.map(data => {
          return (
            <Button
              key={data}
              onPress={() => setPage(data)}
            >
              <ButtonText style={{ color: data === page ? "#209DF5" : "rgba(0,0,0,0.5)" }}>
                {data}</ButtonText>
            </Button>
          )
        })
      }
      <Button onPress={() => setPage(page + 1)} disabled={page === numPages}>
        <ButtonText>&gt;</ButtonText>
      </Button>
    </Section>
  )
}
