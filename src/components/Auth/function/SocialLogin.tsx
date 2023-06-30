import react, {useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useContext } from "react";
import { setNickname, setAccessToken, setRefreshToken } from "../../../common/storage";
import { LoginContext } from "../../../common/Context";
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MyPageParams, MyPageProps } from '../../../pages/MyPage';
import { Alert, Dimensions, StyleSheet } from 'react-native';
// Social login
// kakao
import * as KakaoLogin from '@react-native-seoul/kakao-login';
// naver
import NaverLogin from '@react-native-seoul/naver-login';
// google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID, NAVER_APP_CLIENT_ID, NAVER_APP_CLIENT_SECRET, NAVER_APP_SERVICE_URL_SCHEME } from 'react-native-dotenv';
import { Request } from '../../../common/requests';
import styled from 'styled-components/native';
import { TextPretendard as Text } from '../../../common/CustomText';
import Kakao from '../../../assets/img/Auth/Social_kakao.svg';
import Naver from '../../../assets/img/Auth/Social_naver.svg';
import Google from '../../../assets/img/Auth/Social_google.svg';
import { View } from 'react-native';
import { RegisterParams } from '../Register';

const request = new Request();
const {width, height} = Dimensions.get('window');

const SocialButton = styled.TouchableOpacity`
  width: ${width * 0.85}px;
  height: 48px;
  border-radius: 12px;
  position: relative;
  display: flex;
  margin-vertical: 8px;
  justify-content: center;
`

export const processLoginResponse = (response:any) => {
  const {isLogin, setLogin} = useContext(LoginContext);
  const navigation = useNavigation<StackNavigationProp<MyPageProps>>();
  if (response.status == 200) {
    const nickname = response.data.data.nickname
    const accessToken = response.data.data.access
    const refreshToken = response.data.data.refresh
    setNickname(nickname)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setLogin(true);
    navigation.navigate('mypage');
  } else if (response.status == 400) {
    Alert.alert('올바른 이메일과 비밀번호를 입력해주세요')
  } else if (response.status == 404) {
    Alert.alert('존재하지 않는 이메일입니다')
  }
  else {
    Alert.alert('예상치 못한 오류가 발생하였습니다.')
  }
}

export const kakao_login = () => {
  KakaoLogin.login().then((result) => {
    console.log("카카오 로그인 성공", JSON.stringify(result));
    return request.get('/users/kakao/callback/', {
      access_token: result.accessToken,
    });
  }).then((response) => {
    processLoginResponse(response);
  }).catch((error) => {
    Alert.alert('카카오 로그인이 실패하였습니다')
  });
};

export const naver_login = async () => {
  NaverLogin.login({
    appName: 'SASM',
    consumerKey: NAVER_APP_CLIENT_ID,
    consumerSecret: NAVER_APP_CLIENT_SECRET,
    serviceUrlScheme: NAVER_APP_SERVICE_URL_SCHEME,
  }).then(({ isSuccess, successResponse }) => {
    if (isSuccess) {
      console.log("네이버 로그인 성공", successResponse?.accessToken);
      return request.get('/users/naver/callback/', {
        access_token: successResponse?.accessToken,
      });
    }
    else {
      throw new Error("undefined error");
    }
  }).then((response) => {
    processLoginResponse(response);
  }).catch((error) => {
    Alert.alert('네이버 로그인이 실패하였습니다')
  });

};

const google_configure = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
};

export const google_login = () => {
  GoogleSignin.signIn().then(({ idToken }) => {
    console.log("구글 로그인 성공", idToken);
    GoogleSignin.getTokens().then((res) => {
      console.log("access token!!", res.accessToken);
      return request.get('/users/google/callback/', {
        access_token: res.accessToken,
      });
    }).then((response) => {
      processLoginResponse(response);
    });
  }).catch((error) => {
    Alert.alert('구글 로그인이 실패하였습니다')
  });
}

export const SocialLogin = ({ type }: { type: string }) => {
  const navigation = useNavigation<StackNavigationProp<RegisterParams>>();
  const navigationToMypage = useNavigation<StackNavigationProp<MyPageProps>>();

  useEffect(() => {
    google_configure();
  }, [])
  return (
    <View>
      <SocialButton style={{ borderColor: 'black', borderWidth: 1 }} onPress={google_login}>
        <Google width={15} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={{ ...TextStyles.label }}>구글로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </SocialButton>
      <SocialButton style={{ backgroundColor: '#03C75A' }} onPress={naver_login}>
        <Naver width={15} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={{ ...TextStyles.label, color: '#FFFFFF' }}>네이버로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </SocialButton>
      <SocialButton style={{ backgroundColor: '#FEE500' }} onPress={kakao_login}>
        <Kakao width={15} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={{ ...TextStyles.label }}>카카오로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </SocialButton>
      {
        type == 'register' &&
        <SocialButton style={{ borderColor: '#67D393', borderWidth: 1 }} onPress={()=>{navigation.navigate('email')}}>
          <Text style={{ ...TextStyles.label }}>이메일로 회원가입</Text>
        </SocialButton>
      }
      {
        type == 'register' &&
        <SocialButton onPress={()=>{navigationToMypage.navigate('login')}}>
          <Text style={{fontSize: 16, lineHeight: 24, letteringSpace: -0.6, color:'#848484', alignSelf: 'center'}}>로그인</Text>
        </SocialButton>
      }
    </View>
  )
}

const TextStyles =  StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    alignSelf: 'center',
    letterSpacing: -0.6
  },
})