import { useState, useEffect, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import BoardItem from '../components/BoardItem';
import { ForestContext } from './ForestContext';

import { Request } from '../../../common/requests';
import { PostUploadParams } from '../PostUpload';

const CategoryForm = ({ tab, setTab, navigation, post }: PostUploadParams) => {
  const request = new Request();
  const { category, setCategory, semiCategories, forest } = useContext(ForestContext);
  const [boardLists, setBoardLists] = useState([] as any);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const hasUnsavedChanges = Boolean(category.id !== 0 || semiCategories.length > 0 || forest.title.length > 0 || forest.hashtags.length > 0 || forest.subtitle.length > 0 || forest.content.length > 0 )
  const { width, height } = Dimensions.get('window');

  const getBoardItems = async () => {
    const response = await request.get('/forest/categories/');
    setBoardLists(response.data.data.results);
  }

  useEffect(() => {
    getBoardItems();
    if (category.id !== 0) {
      setSelectedId(category.id)
    }
  }, [category]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e: any) => {
        if (!hasUnsavedChanges) {
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          '나가시겠습니까?',
          '입력하신 정보는 저장되지 않습니다.',
          [
            { text: "머무르기", style: 'cancel', onPress: () => {} },
            {
              text: '나가기',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  return (
    <View>
      <FormHeader title='포레스트 작성' onLeft={() => navigation.goBack()} onRight={() => setTab(tab+1)} />
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 150}}>
        <Text style={{fontSize: 16, color: '#202020', marginBottom: 30}}>카테고리를 선택해 주세요</Text>
        <FlatList
          data={boardLists}
          renderItem={({ item }: any) => (
            <BoardItem
              id={item.id}
              data={item}
              onPress={(id: number) => {
                if (selectedId === id) {
                  setSelectedId(null); // 선택 상태를 해제합니다.
                  setCategory({ id: 0, name: ''})
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
        {(selectedId) &&
          <TouchableOpacity style={{backgroundColor: '#67D393', width: 180, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, position: 'absolute', top: height-350 }} 
            onPress={() => setTab(1)}
          >
            <Text style={{fontWeight: '700', fontSize: 16, color: 'white'}}>다음</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default CategoryForm;