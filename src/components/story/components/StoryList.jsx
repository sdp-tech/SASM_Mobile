import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Loading from '../../../common/Loading';
import styled from 'styled-components/native';
import Pagination from '../../../common/Pagination';
import { Request } from '../../../common/requests';
import ItemCard from './ItemCard';

const StorySection = styled.View`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  //flex-direction: column;
  // overflow: hidden;
  grid-area: story;
  // height: 100%;
  height: auto;
  margin-bottom: 5px;
  background-color: white;
`;
const FooterSection = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  grid-area: story;
  height: 12%;
  border: 1px solid blue;
  background-color: blue;
`;
const CardSection = styled.View`
  box-sizing: border-box;
  position: relative;
  //   margin: 15px 0px 15px 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-area: story;
  justify-content: center;
  align-items: center;
`;
const NothingSearched = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15%;
`;

const StoryList = ({ info }) => {
    return (
        
            //<StorySection>
            <>
                {info.length === 0 ? (
                    <NothingSearched>
                        <Text>해당하는 스토리가 없습니다</Text>
                    </NothingSearched>
                ) : (
                    <FlatList
                        data = {info}
                        renderItem = {({item}) => (
                            <CardSection>
                                <ItemCard
                                    id = {item.id}
                                    rep_pic = {item.rep_pic}
                                    place_name = {item.place_name}
                                    title = {item.title}
                                    category = {item.category}
                                    // semi_category = {item.semi_category}
                                    preview = {item.preview}
                                 />
                            </CardSection>
                        )}
                        keyExtractor = {(item, index) => index}
                        //numColumns = {1}
                     />
                )}
            </>
            //</StorySection>
    )
}

export default StoryList;