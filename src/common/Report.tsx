import { useEffect, useRef, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { TextPretendard as Text } from "./CustomText";
import { View, FlatList, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import ReportIcon from '../assets/img/common/Report.svg';
import Arrow from "../assets/img/common/Arrow.svg";
import Check from '../assets/img/common/Check.svg';

interface ReportProps {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  reported: string;
  onReport: any;
}

const Report = ({ modalVisible, setModalVisible, reported, onReport }: ReportProps) => {
  const reportLists = [
    "지나친 광고성 컨텐츠입니다. (상업적 홍보)",
    "욕설이 포함된 컨텐츠입니다.",
    "성희롱이 포함된 컨텐츠입니다.",
    "기타"
  ]

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [350], []);

  const openModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop style={{flex: 1}} {...props} onPress={() => setModalVisible(false)} pressBehavior="close" appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  useEffect(()=>{
    if(modalVisible){
      openModal();
    }
  }, [modalVisible])

  return (
    // <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{backgroundColor: '#D9D9D9'}}
      >
        {reported.length == 0 ? (  
        <>         
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <ReportIcon width={20} height={20} color={'#FF4C00'} />
            <Text style={{marginLeft: 8, fontSize: 18, fontWeight: '700',  letterSpacing: -0.6}}>이 글을 신고하는 이유가 무엇인가요?</Text>
          </View>
          <Text style={{textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 18, letterSpacing: -0.6, color: '#848484'}}>지적재산권 침해를 신고하는 경우를 제외하고{"\n"}회원님의 신고는 익명으로 처리됩니다.</Text>
        </View>
        <FlatList data={reportLists} renderItem={({item}) => {
          return (
            <TouchableOpacity onPress={() => onReport(item)} style={{flexDirection: 'row', padding: 15, borderTopColor: '#E3E3E3', borderTopWidth: 1, alignItems: 'center'}}>
              <Text style={{color: '#202020', fontSize: 14, fontWeight: '500', flex: 1}}>{item}</Text>
              <Arrow width={18} height={18} color={'#67D393'} />
            </TouchableOpacity>
          )
        }}
        />
        </>) : (
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
          <Check color={'#67D393'} width={50} height={50} />
          <Text style={{marginTop: 15, fontSize: 18, fontWeight: '700',  letterSpacing: -0.6, color: '#FF4C00'}}>{reported}</Text>
          <Text style={{marginLeft: 8, fontSize: 18, fontWeight: '700',  letterSpacing: -0.6}}>이 글을 신고해주셔서 감사합니다.</Text>
          <Text style={{textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 18, letterSpacing: -0.6, color: '#848484'}}>글을 검토한 후 결과를 알려드리겠습니다.{'\n'}안전한 SASM 환경을 만들 수 있도록 도와주셔서 감사합니다.</Text>
        </View>
        )}
      </BottomSheetModal>
    // </BottomSheetModalProvider>
  )
}

export default Report;