import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { View, Modal, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import FormHeader from '../../../common/FormHeader';
import NextButton from '../../../common/NextButton';
import { Request } from '../../../common/requests';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

interface UserCategoriesProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  categories: Array<Object>
}

const UserCategories = ({ modalVisible, setModalVisible, categories }: UserCategoriesProps) => {
  const [items, setItems] = useState([] as any);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [semiCategories, setSemiCategories] = useState([] as any);
  const request = new Request();

  const getSemiCategories = async () => {
    let _items = [];
    for (let i = 1; i <= 6; i++){
      const response = await request.get(`/forest/semi_categories/`, {category: i}, {});
      _items.push(response.data.data.results);
    }
    setItems(_items);
    const response_user = await request.get('/forest/user_categories/get/');
    setSemiCategories(response_user.data.data.results)
    setSelectedIds(response_user.data.data.results.map((category: any) => category.id));
  }

  useEffect(() => {
    getSemiCategories();
  }, [])

  const saveUserCategories = async () => {
    const response = await request.post('/forest/user_categories/save/', {
      semi_categories: selectedIds
    })
    if(response.status === 200){
      setModalVisible(false)
    } 
    else if(selectedIds.length>8){
      Alert.alert('카테고리는 최대 8개까지 저장 가능합니다.')
    }
    else {
      Alert.alert('나만의 카테고리 저장에 실패하였습니다.')
    }
  }

  return (
    <Modal animationType='slide' visible={modalVisible}>
      <FormHeader title="카테고리 선택" onLeft={() => setModalVisible(false)} onRight={null} begin={true} />
      <FlatList
        data={categories}
        renderItem={({ item }: any) => (
          <View style={{borderBottomWidth: 1, borderBottomColor: '#EDF8F2', paddingVertical: 10, paddingHorizontal: 20}}>
            <Text style={{color: '#67D393', fontSize: 16, marginBottom: 4}}>
              {item.name}
            </Text>
            <FlatList
              data={items[item.id-1]}
              renderItem={({ item }: any) => (
                <TouchableOpacity style={{ borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, marginVertical: 4, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white' }}
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
                  <Text style={{ color: selectedIds.includes(item.id) ? 'white' : '#202020', fontSize: 14, fontWeight: selectedIds.includes(item.id) ? '600' : '400' }}># {item.name}</Text>
                </TouchableOpacity>
              )}
              style={{flexDirection: 'row', flexWrap: 'wrap'}}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <NextButton label="추가" style={{alignSelf: 'center', marginTop: 30}}  
            onPress={saveUserCategories}
          />
        }
      />
    </Modal>
  )
}

export default UserCategories;