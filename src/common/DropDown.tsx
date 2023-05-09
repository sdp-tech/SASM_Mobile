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
      style={{borderWidth: 0, minHeight: 15}}
      textStyle={{fontSize: 10, lineHeight: 12}}
      dropDownContainerStyle={{borderWidth: 0}}
      listItemContainerStyle={{height: 15}}
      tickIconStyle={{width: 10, height: 10}}
      arrowIconStyle={{width: 15, height: 15}}
      containerStyle={{maxWidth: 90}}
    />
  )
}

export default DropDown;