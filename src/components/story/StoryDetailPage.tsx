import StoryDetailBox from './components/StoryDetailBox';
import { StoryProps } from '../../pages/Story';

const StoryDetailPage = ({ navigation, route }: StoryProps) => {
    const id = route.params.id;
    return (
        <>
            <StoryDetailBox id = {id} navigation = {navigation} />
        </>
    )
}

export default StoryDetailPage;