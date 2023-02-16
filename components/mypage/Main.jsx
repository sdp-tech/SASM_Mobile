import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView } from "react-native";

import UserInfoBox from './components/UserInfoBox'

const MyPageMainScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <UserInfoBox navigation={navigation} />
        </SafeAreaView>
    )
}

export default MyPageMainScreen;