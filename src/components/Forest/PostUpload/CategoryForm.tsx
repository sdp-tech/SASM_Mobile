import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import BoardItem from '../components/BoardItem';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Request } from '../../../common/requests';
import { ForestStackParams } from '../../../pages/Forest';

const CategoryForm = ({ navigation, route }: NativeStackScreenProps<ForestStackParams, "CategoryForm">) => {
  const categories = route.params.categories;
  const [category, setCategory] = useState({id: 0, name: ''});
  const { width, height } = Dimensions.get('window')
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FormHeader title='포레스트 작성' onLeft={() => navigation.goBack()} onRight={() => {}} />
      <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 150}}>
        <Text style={{fontSize: 16, color: '#202020', marginBottom: 30}}>카테고리를 선택해 주세요</Text>
        <FlatList
          data={categories}
          renderItem={({ item }: any) => (
            <BoardItem
              id={item.id}
              name={item.name}
              onPress={() => {
                setCategory({id: item.id, name: item.name});
              }}
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
            onPress={() => navigation.navigate('SemiCategoryForm', { category: category })}
          >
            <Text style={{fontWeight: '700', fontSize: 16, color: 'white'}}>다음</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default CategoryForm;