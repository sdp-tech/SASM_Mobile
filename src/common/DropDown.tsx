import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropDownProps {
  items: any;
}
const DropDown = ({ items }: DropDownProps) => {
  const [value, setValue] = useState(1);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      style={{borderWidth:0, height: 10, justifyContent: 'flex-start', alignItems: 'flex-start'}}
      textStyle={{fontSize: 10}}
      containerStyle={{height: 10, padding: 0}}
      dropDownContainerStyle={{borderWidth: 0}}
      listItemContainerStyle={{height: 15}}
      tickIconStyle={{width: 10, height: 10}}
      arrowIconStyle={{width: 15, height: 15}}
      //zIndex={3000}
      //zIndexInverse={3000}
    />
  )
}

export default DropDown;