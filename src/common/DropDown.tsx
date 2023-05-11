import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropDownProps {
  items: any[];
  isBorder: boolean;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}
const DropDown = ({ items, isBorder, value, setValue }: DropDownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      style={{ borderWidth: isBorder ? 1 : 0, justifyContent: 'flex-start', alignItems: 'center', minHeight: 20 }}
      textStyle={{ fontSize: 10 }}
      dropDownContainerStyle={{ borderWidth: isBorder ? 1 : 0 }}
      listItemContainerStyle={{ height: 20, borderTopWidth: isBorder ? 1 : 0, }}
      tickIconStyle={{ width: 10, height: 10 }}
      arrowIconStyle={{ width: 15, height: 15 }}
    //zIndex={3000}
    //zIndexInverse={3000}
    />
  )
}

export default DropDown;