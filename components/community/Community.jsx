import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView } from "react-native";
import Category from '../../common/Category';
import Loading from '../../common/Loading';

const CommunityScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <Category/>
        </SafeAreaView>
    )
}

export default CommunityScreen;