import { useEffect } from 'react';
import { View, Text } from 'react-native';
import StoryDetailBox from './components/StoryDetailBox';

const StoryDetailPage = ({ navigation, route }) => {
    const id = route.params.id;
    return (
        <>
            <StoryDetailBox id = {id} />
        </>
    )
}

export default StoryDetailPage;