import { useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
// import { useCookies } from 'react-cookie';
import { Request } from '../../../common/requests';
import { useNavigation } from '@react-navigation/native';

const CommentBox = styled.View`
  margin-bottom: 3vh;
`
const InfoBox = styled.View`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  margin-bottom: 1vh;
`
const UserBox = styled.View`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 1.25rem;
  font-weight: 700;
  }
`
const DateBox = styled.View`
  @media screen and (max-width: 768px) {
  }
`
const ContentBox = styled.View`
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  padding-left: 65px;
  @media screen and (max-width: 768px) {
    padding: 0;
    font-size: 0.75rem;
  }
`
const ButtonBox = styled.View`
  display: flex;
  justify-content: center;
  position: absolute;
  right: 0;
  width: 12%;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    width: auto;
  }
`
const Button = styled.Button`
  cursor: pointer;
  border: none;
  outline: none;
  background-color: white;
  height: 100%;
  font-size: 1rem;
  font-weight: 600;
  @media screen and (max-width: 768px) {
    font-size: 0.75rem;
  }
`
const TextArea = styled.TextInput`
    display:block;
    margin:0;
    width: 100%;
    margin-right: 3vw;
    height: 5vh;
    resize:none;
    border: 1px rgba(0,0,0,0.3) solid;
    padding: 11px 30px;
    border-radius:1000px;
    @media screen and (max-width: 768px) {
      height: 3vh;
      padding: 5px 15px;
    }
`
const TextButton = ({text, onPress}) => {
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

const Comment = ({ data }) => {
    const date = data.updated_at.slice(0, 10);
    const [update, setUpdate] = useState(false);
    //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    // const token = cookies.name; // 쿠키에서 id 를 꺼내기
    //const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기
    const navigation = useNavigation();
    const request = new Request();
    //const email = localStorage.getItem('email');
    const [updateText, setUpdateText] = useState(data.content);

    const handleUpdate = () => {
        setUpdate(!update);
    }
    const deleteComment = async () => {
        const response = await request.delete(`/stories/comments/${data.id}`, {});
        window.location.reload();
    }
    const updateComment = async () => {
        const response = await request.patch(`/stories/comments/${data.id}`, {
            content: updateText,
        });
        setUpdateText(updateText);
        window.location.reload();
    }
    // let isWriter = false;
    // if (data.email == email) {
    //     isWriter = true;
    // }
    return (
        <View>
            <View style = {{ flexDirection: 'row' }}>
                <Image src = {data.profile_image}
                    style = {{
                        width: 36,
                        height: 36,
                        borderRadius: 50,
                    }} />
                <Text>{data.nickname}</Text>
                <Text>{date}</Text>
                {update ?
                    <>
                        <TextButton onPress = {updateComment} text = '저장' />
                        <TextButton onPress = {handleUpdate} text = '취소' />
                    </>
                    :
                    <>
                        <TextButton onPress = {() => {
                            handleUpdate();
                        }}
                            text = '수정'
                            style = {{ }} />
                        <TextButton onPress = {deleteComment} text = '삭제' />
                    </>
                }
            </View>
            <View>
                {update ? 
                    <>
                        <TextInput
                            value = {updateText}
                            onChangeText = {setUpdateText}
                            placeholder = '수정할 텍스트 입력'
                            style = {{
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: 24,
                                borderWidth: 1,
                                width: 260,
                                height: 24,
                                textAlign: 'center'
                            }}
                         />
                    </>
                    :
                    <><Text>{data.content}</Text></>
                }
            </View>
        </View>
    )
}

export default Comment;