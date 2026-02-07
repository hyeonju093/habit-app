import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4c6ef5',
                tabBarInactiveTintColor: '#adb5bd',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: '오늘',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🗓️</Text>,
                }}
            />
            <Tab.Screen
                name="Stats"
                component={StatsScreen}
                options={{
                    tabBarLabel: '통계',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;