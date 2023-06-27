import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import BoardItem from '../components/BoardItem';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Request } from '../../../common/requests';
import { ForestStackParams } from '../../../pages/Forest';

const CategoryForm = ({ navigation, route }: NativeStackScreenProps<ForestStackParams, "CategoryForm">) => {
  const request = new Request();
  const post = route.params?.post;
  const [boardLists, setBoardLists] = useState([] as any);
  const [category, setCategory] = useState({id: 0, name: ''});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { width, height } = Dimensions.get('window');

  const getBoardItems = async () => {
    const response = await request.get('/forest/categories/');
    setBoardLists(response.data.data.results);
  }

  useEffect(() => {
    getBoardItems();
    if (post) {
      setCategory(post.category);
      setSelectedId(post.category.id)
    }
  }, [route])
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FormHeader title='포레스트 작성' onLeft={() => navigation.goBack()} onRight={() => {}} />
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 150}}>
        <Text style={{fontSize: 16, color: '#202020', marginBottom: 30}}>카테고리를 선택해 주세요</Text>
        <FlatList
          data={boardLists}
          renderItem={({ item }: any) => (
            <BoardItem
              id={item.id}
              name={item.name}
              onPress={(id: number) => {
                if (selectedId === id) {
                  setSelectedId(null); // 선택 상태를 해제합니다.
                } else {
                  setSelectedId(id); // 선택 상태를 토글합니다.
                  setCategory({ id: item.id, name: item.name });
                }
              }}
              isSelected={selectedId === item.id}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{
            justifyContent: "space-between",
            margin: 10,
          }}
          numColumns={3}
          scrollEnabled={false}
        />
        { category.id > 0 &&
          <TouchableOpacity style={{backgroundColor: '#67D393', width: 180, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, position: 'absolute', top: height-350 }} 
            onPress={() => navigation.navigate('SemiCategoryForm', { post: post, category: category })}
          >
            <Text style={{fontWeight: '700', fontSize: 16, color: 'white'}}>다음</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default CategoryForm;