import React, { useState, useEffect } from "react";
import { StoryDetail } from "../../story/components/StoryDetailBox";
import { Request } from "../../../common/requests";
import { View, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import RenderHTML from "react-native-render-html";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window');

export default function StoryDetailModal({ id }: { id: number }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [detailData, setDetailData] = useState<StoryDetail>({
    id: 0,
    title: '',
    created: '',
    profile: '',
    rep_pic: '',
    extra_pics: [],
    story_review: '',
    tag: '',
    story_like: false,
    category: '',
    semi_category: '',
    place_name: '',
    views: 0,
    html_content: '',
    writer: '',
    nickname: '',
    map_image: '',
    writer_is_verified: '',
    preview: ''
  });
  const request = new Request();
  const markup = {
    html: `${detailData?.html_content}`
  }
  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true
    }
  };
  const getStoryDetail = async () => {
    setLoading(true);
    const response_detail = await request.get(`/stories/story_detail/${id}/`);
    setDetailData(response_detail.data.data);
    setLoading(false);
  }

  useEffect(() => {
    getStoryDetail();
  }, [])

  return (
    <>
      {
        loading ?
          <ActivityIndicator style={{flex:1}}/>
          :
          <ScrollView>
            <Text style={{...StoryTextStyles.category, marginLeft: 20, marginTop: 20 }}>{detailData.category}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 20 }}>
              <View style={{ flex: 6, justifyContent: 'center' }}>
                <Text style={StoryTextStyles.title}>{detailData.title}</Text>
                <Text style={StoryTextStyles.semi_title}>{detailData.story_review}</Text>
                <Text style={StoryTextStyles.date}>{detailData.created.slice(0, 10).replace(/-/gi, '.')} 작성</Text>
              </View>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <View style={{ width: 50, height: 50, borderRadius: 60, backgroundColor: '#CCCCCC' }}></View>
                <View style={{ position: 'absolute', width: 34, height: 12, backgroundColor: detailData.writer_is_verified ? '#209DF5' : '#89C77F', borderRadius: 10, top: 42, left: 8.5 }}>
                  <Text style={StoryTextStyles.verified}>{detailData!.writer_is_verified ? 'Editor' : 'User'}</Text>
                </View>
                <Text style={StoryTextStyles.writer}>{detailData.nickname}</Text>
              </View>
            </View>
            <View style={{ borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1 }} />
            <View style={{ paddingHorizontal: 20 }}>
              <RenderHTML
                source={markup}
                renderersProps={renderersProps}
              />
            </View>
          </ScrollView>
      }
    </>
  )
}

const StoryTextStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 5,
  },
  semi_title: {
    fontSize: 12,
    fontWeight: '400',
  },
  date: {
    fontSize: 10,
    fontWeight: '400',
    marginTop: 4,
    color: '#676767'
  },
  category: {
    fontSize: 12,
    fontWeight: '400',
    marginVertical: 10,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    overflow: 'hidden',
    lineHeight: 14,
    color: '#ADADAD',
    borderColor: '#B1B1B1',
    borderWidth: 1
  },
  verified: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  writer: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 8,
  },
  subject: {
    fontSize: 14,
    fontWeight: '500',
    margin: 15,
  }
})