import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { View } from 'react-native';
import { ForestStackParams } from '../../pages/Forest';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CategoryForm from './PostUpload/CategoryForm';
import SemiCategoryForm from './PostUpload/SemiCategoryForm';
import ForestForm from './PostUpload/ForestForm';
import { ForestProvider } from './PostUpload/ForestContext';

export interface PostUploadParams {
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  navigation?: any;
  post?: any;
}

const PostUploadScreen = ({navigation, route}: NativeStackScreenProps<ForestStackParams, "PostUpload">) => {
  const [tab, setTab] = useState<number>(0);
  const [post, setPost] = useState({ id: 0, title: "", subtitle: "", content: "", category: {id: 0, name: ''}, semi_categories: [], hashtags: [], photos: [], rep_pic: "" })

  useEffect(() => {
    if(route.params?.post){
      const {id, title, subtitle, content, category, semi_categories, hashtags, photos, rep_pic} = route.params?.post;
      setPost({ id: id, title: title, subtitle: subtitle, content: content, category: category, semi_categories: semi_categories, hashtags: hashtags, photos: photos, rep_pic: rep_pic });
      setTab(2);
    }
  }, [route.params?.post])

  return (
    <ForestProvider>
    <View style={{flex: 1, backgroundColor: 'white'}}>
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