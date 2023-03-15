import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const StoryRecommend = (props) => {
    const data = props.data.results;
    const navigation = useNavigation();

    return (
        <View>
            {data.map((it, index) => (
                <TouchableOpacity
                    onPress = {(e) => {
                        navigation.replace('StoryDetail', { id: it.id })
                    }}>
                    <View style = {{ flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1 }}>
                        <Text>{it.title}</Text>
                        <Text>{it.created.slice(0, 10)}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default StoryRecommend;