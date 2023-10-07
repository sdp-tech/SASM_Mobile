import { useEffect, useState,useContext, useRef, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { TextPretendard as Text } from './CustomText';
import { useFocusEffect } from '@react-navigation/native';
import { View ,TouchableOpacity, Image, Alert, StyleSheet, FlatList, Dimensions, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Request } from './requests';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import CommentIcon from '../assets/img/Story/Comment.svg';
import Arrow from "../assets/img/common/Arrow.svg";
import { Comment as ForestComment}  from "../components/Forest/components/Comment";
import { Comment as StoryComment} from "../components/story/components/Comment";
import { WriteComment as ForestWrite} from "../components/Forest/components/WriteComment";
import { WriteComment as StoryWrite} from "../components/story/components/WriteComment";

interface PopCommentProps {
    data: any;
    post_id: number;
    email: string;
    isLogin: boolean;
    navigation: any;
    modalVisible: boolean;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    repo: boolean;
    //repo - true : Foerst
    //      - false : Story
}

const PopComment = ({ data, post_id, email, isLogin, navigation, modalVisible, setModalVisible, repo }: PopCommentProps) => {
    const scrollRef = useRef<FlatList>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [updateText, setUpdateText] = useState<string>('');
    const [comment, setComment] = useState([] as any);
    const [commentId, setCommentId] = useState<number>(0);
    const request = new Request();
    const [loading, setLoading] = useState<boolean>(true);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => [550], []);

    const openModal = () => {
        bottomSheetModalRef.current?.present();
    };

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop style={{flex: 1}} 
        {...props} onPress={() => setModalVisible(false)} 
        pressBehavior="close" 
        appearsOnIndex={0} 
        disappearsOnIndex={-1} />,
        [],
    );
    const callback = (text: string, id: number) => {
                setUpdateText(text);
                setCommentId(id);

    };
    const reRenderScreen = () => {
                setRefreshing(true);
                setUpdateText('');
                setRefreshing(false);
    };
    const loadComment = async () => {
        setLoading(true);
        if (repo){
        const response= await request.get(`/forest/${post_id}/comments/`, {}, {});
        setComment(response.data.data.results)
        }
        else{
        const response= await request.get("/stories/comments/", { story: post_id }, null);
        setComment(response.data.data.results)
        //////////////////
        // console.error(response.data.data.results)
        }
        // setComment(response.data.data.results);
        setLoading(false);
        
      }
    
      const onRefresh = async () => {
        if(!refreshing){
          setRefreshing(true);
          await loadComment();
          setRefreshing(false);
        }
      }
    useEffect(()=>{
        if(modalVisible){
        openModal();
        }
        // console.log(comment);
    }, [modalVisible])

    useFocusEffect(
        useCallback(()=>{
        loadComment();
        }
        ,[refreshing])
    );
    
    return(
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#D9D9D9'}}>
                    <>
                    <FlatList
                        ref={scrollRef}
                        data={comment.slice(0,3)}
                        style={styles.container}
                        onRefresh={reRenderScreen}
                        refreshing={refreshing}
                        ListHeaderComponent={
                        <>
                            { <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>한줄평</Text>
                                <CommentIcon color={'black'} />
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { repo?navigation.navigate('PostComments', { id: post_id, email: email }) :navigation.navigate('CommentList', { id: post_id, email: email }) }}>
                                <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
                                <Arrow width={12} height={12} color={'black'} />
                            </TouchableOpacity>
                            </View> }
                            {repo?
                            <ForestWrite id={post_id} reRenderScreen={reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation}/>
                            :
                            <StoryWrite id={post_id} reRenderScreen={reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation} />
                            }
                        </>
                        }
                        renderItem={({ item }) => {
                        return (
                            repo?
                            <ForestComment data={item} reRenderScreen={reRenderScreen} post_id={post_id} email={email} isLogin={isLogin} navigation={navigation} callback={callback} />
                            : <StoryComment data={item} reRenderScreen={reRenderScreen} story_id={post_id} email={email} isLogin={isLogin} navigation={navigation} callback={callback} /> 
                        )
                        }}
                    />
                    </> 
        </BottomSheetModal>
    )
    
}


const textStyles = StyleSheet.create({
    nickname: {
        fontSize: 14,
        fontWeight: '600',
    },
    date: {
        fontSize: 12,
        fontWeight: '400',
        color: '#676767',
        marginLeft: 8,
        lineHeight: 18
    },
    content: {
        fontSize: 14,
        fontWeight: '400',
        color: '#202020',
        lineHeight: 20,
        letterSpacing: -0.6,
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
export default PopComment;