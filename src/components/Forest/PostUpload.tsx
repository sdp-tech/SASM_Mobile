import { useState, useEffect, useRef, useCallback, useContext, SetStateAction, Dispatch } from 'react';
import { View, TouchableOpacity, Dimensions, ImageBackground, TextInput, ScrollView, Modal, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import FormHeader from '../../common/FormHeader';
import FinishModal from '../../common/FinishModal';

import { Request } from '../../common/requests';
import { ForestStackParams } from '../../pages/Forest';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CategoryForm from './PostUpload/CategoryForm';
import SemiCategoryForm from './PostUpload/SemiCategoryForm';
import ForestForm from './PostUpload/ForestForm';
import { ForestContext, ForestProvider } from './PostUpload/ForestContext';

export interface PostUploadParams {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  navigation?: any;
  post?: any;
}

const PostUploadScreen = ({navigation, route}: NativeStackScreenProps<ForestStackParams, "PostUpload">) => {
  const [tab, setTab] = useState<number>(0);
  const forest = route.params?.post;
  const [post, setPost] = useState({ id: 0, title: "", subtitle: "", content: "", category: {id: 0, name: ''}, semi_categories: [], hashtags: [], photos: [], rep_pic: "" })
  useEffect(() => {
    if(forest){
      const {id, title, subtitle, content, category, semi_categories, hashtags, photos, rep_pic} = forest;
      setPost({ id: id, title: title, subtitle: subtitle, content: content, category: category, semi_categories: semi_categories, hashtags: hashtags, photos: photos, rep_pic: rep_pic });
      setTab(2);
    }
  }, [forest])

  return (
    <ForestProvider>
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <FormHeader title='포레스트 작성' onLeft={() => tab === 0 ? navigation.goBack() : setTab(tab-1)} onRight={() => setTab(tab+1)} /> */}
      {
        {
          0:
            <CategoryForm tab={tab} setTab={setTab} navigation={navigation} post={post} />
          ,
          1:
            <SemiCategoryForm tab={tab} setTab={setTab} post={post} />
          ,
          2:
            <ForestForm tab={tab} setTab={setTab} navigation={navigation} post={post} />
        }[tab]
      }
    </View>
    </ForestProvider>
  )
}

export default PostUploadScreen;