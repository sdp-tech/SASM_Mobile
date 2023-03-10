import * as ImagePicker from 'react-native-image-picker';

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

export const CameraActions: Action[] = [
    //카메라 & 갤러리 세팅
    {
      title: '카메라',
      type: 'capture',
      options: {
        mediaType: 'photo',
        includeBase64: false,
      },
    },
    {
      title: '앨범',
      type: 'library',
      options: {
        selectionLimit: 3,
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 150,
        maxWidth: 150,
      },
    }
  ];