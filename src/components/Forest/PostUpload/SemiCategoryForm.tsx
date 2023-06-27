import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Request } from '../../../common/requests';
import { ForestStackParams } from '../../../pages/Forest';

const SemiCategoryForm = ({ navigation, route }: NativeStackScreenProps<ForestStackParams, "SemiCategoryForm">) => {
  const category = route.params.category;
  const post = route.params?.post;
  const [semiCategories, setSemiCategories] = useState([] as any);
  const { width, height } = Dimensions.get('window');
  const [items, setItems] = useState([] as any);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const request = new Request();

  const getSemiCategories = async () => {
    const response = await request.get(`/forest/semi_categories/`, {category: category.id}, {});
    setItems(response.data.data.results);
  }

  useEffect(() => {
    getSemiCategories();
    if (post){
      setSemiCategories(post.semi_categories);
      setSelectedIds(post.semi_categories.map((category: any) => category.id));
    }
  }, [category])
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FormHeader title='포레스트 작성' onLeft={() => navigation.navigate('CategoryForm', {post: post})} onRight={() => {}} />
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 150}}>
        <Text style={{fontSize: 16, color: '#202020', marginBottom: 30}}>세부 카테고리를 선택해 주세요</Text>
        <FlatList
          data={items}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={{borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, marginHorizontal: 8, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white'}}
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
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{
            justifyContent: "space-between",
            margin: 10,
          }}
          numColumns={3}
          scrollEnabled={false}
        />
        { semiCategories.length > 0 &&
          <TouchableOpacity style={{backgroundColor: '#67D393', width: 180, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20, position: 'absolute', top: height-350}}
            onPress={() => {navigation.navigate('ForestForm', { category: category, semi_categories: semiCategories, post: post })}}
          >
            <Text style={{fontWeight: '700', fontSize: 16, color: 'white'}}>다음</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default SemiCategoryForm;