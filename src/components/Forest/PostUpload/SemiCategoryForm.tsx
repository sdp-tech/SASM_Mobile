import { useState, useEffect, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import { ForestContext } from './ForestContext';

import { Request } from '../../../common/requests';
import { PostUploadParams } from '../PostUpload';
import NextButton from '../../../common/NextButton';

const SemiCategoryForm = ({ tab, setTab, post }: PostUploadParams) => {
  const { category, setCategory, semiCategories, setSemiCategories } = useContext(ForestContext);
  const { width, height } = Dimensions.get('window');
  const [items, setItems] = useState([] as any);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const request = new Request();

  const getSemiCategories = async () => {
    const response = await request.get(`/forest/semi_categories/`, {category: category.id == 0 ? post.category.id : category.id}, {});
    setItems(response.data.data.results);
  }

  useEffect(() => {
    getSemiCategories();
    if (post.category.id !== 0 && post.category.id !== category.id) {
      setSemiCategories([]);
    }
    setSelectedIds(semiCategories.map((category: any) => category.id))
  }, [category])

  return (
    <View>
      <FormHeader title='포레스트 작성' onLeft={() => setTab(tab-1)} onRight={selectedIds.length > 0 ? () => setTab(tab+1) : () => Alert.alert('세부 카테고리를 선택해주세요')} />
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: height * 0.2}}>
        <Text style={{fontSize: 16, color: '#202020', marginBottom: 80}}>세부 카테고리를 선택해 주세요</Text>
        <FlatList
          data={items}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={{borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, margin: 4, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white'}}
              onPress={() => {
                if (selectedIds.includes(item.id)) {
                  setSelectedIds(selectedIds.filter(id => id !== item.id));
                  setSemiCategories(semiCategories.filter((category: any) => category.id !== item.id));
                } else {
                  setSelectedIds([...selectedIds, item.id]);
                  setSemiCategories([...semiCategories, item]);
                }
              }}
            >
              <Text style={{color: selectedIds.includes(item.id) ? 'white' : '#202020', fontSize: 14, fontWeight: selectedIds.includes(item.id) ? '600' : '400'}}># {item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
        {(selectedIds.length > 0) &&
          <NextButton label="다음" style={{position: 'absolute', bottom: 30}}  
            onPress={() => setTab(2)}
          />
        }
      </View>
    </View>
  )
}

export default SemiCategoryForm;