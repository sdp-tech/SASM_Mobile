import React from 'react';
import { Share, Alert, TouchableOpacity } from 'react-native';
import ShareIcon from '../assets/img/common/Share.svg';

interface ShareButtonProps {
    message: string;
    color: 'black' | 'white';
}

// TODO: 카카오톡 공유하기 등 기능 확장 필요
export default function ShareButton({ message, color }: ShareButtonProps): JSX.Element {
    const getPreview = (message: string) => {
        return message
            .replace(/<.*?>/g, ' ') // 그외 html 태그 치환
            .replace(/\s{2,}/g, ' ') // space 두개인 경우 하나로 치환
            .substring(0, 100) // 50자만 잘라서 반환
    }
    const onShare = async () => {
        try {
            await Share.share({ message: getPreview(message) });
        } catch (error: any) {
            Alert.alert('공유하기가 실패하였습니다.');
        }
    };

    return (
        <TouchableOpacity style={{ marginLeft: 5, marginRight: 5 }} onPress={onShare}>
            <ShareIcon color={color}/>
        </TouchableOpacity>
    )
}
