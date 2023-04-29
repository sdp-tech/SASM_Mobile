import React, { FC, ReactElement, useRef, useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';
import Arrow from '../assets/img/common/Arrow.svg';

interface Props {
  data: Array<{ label: string; value: number }>;
  onSelect: (item: { label: string; value: number }) => void;
}

const Dropdown: FC<Props> = ({ data, onSelect }) => {
  const DropdownButton = useRef<TouchableOpacity>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState({label: '조회수 순', value: 1});
  const [dropdownTop, setDropdownTop] = useState(0);

  useEffect(() => {
    console.log(visible)
  })
  const toggleDropdown = (): void => {
    // visible ? setVisible(false) : openDropdown();
    setVisible(!visible)
  };

  const openDropdown = (): void => {
    DropdownButton.current?.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
      setDropdownTop(py);
    });
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.buttonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={{ top: 180 }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={() => setVisible(!visible)}
    >
      {renderDropdown()}
      <View style={{flexDirection:'row'}}>
      <Text style={styles.buttonText}>
        {!!selected && selected.label}
      </Text>
      <Arrow width={9} height={9} transform={[{rotate: '90deg'}]}/>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 50,
    //zIndex: 1,
  },
  buttonText: {
    //flex: 1,
    textAlign: 'left',
    fontSize: 10,
    lineHeight: 12
  },
  dropdown: {
    // width: '100%',
    // shadowColor: '#000000',
    // shadowRadius: 4,
    // shadowOffset: { height: 4, width: 0 },
    // shadowOpacity: 0.5,
  },
  overlay: {
    width: 86,
    alignSelf: 'flex-end'
    //height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    //paddingVertical: 10,
    //borderBottomWidth: 1,
  },
});

export default Dropdown;