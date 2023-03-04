# 개발환경 구축
### 1. React Native
- Mac: https://dev-yakuza.posstree.com/ko/react-native/install-on-mac/   
- Window: https://dev-yakuza.posstree.com/ko/react-native/install-on-windows/

### 2. Git Fork
- Fork your own copy of sdp-tech/SASM_Mobile
- Git clone with VSCode

### 3. Property List
- 공유 받은 local.properties를 andorid 폴더에 넣기
- Info.plist를 ios/sasm 폴더에 넣기

### 4. package.json 패키지 설치
```
npm install yarn
yarn install
```

### 5. Build
```
yarn react-native run-ios
yarn react-native run-android
``` 

### 6. 맵 초기 위치 설정
- Xcode Features > Location > Custom Location에서 위치 설정 후 reload   
ex. Latitude: 37.5, Longitude: 127.5
