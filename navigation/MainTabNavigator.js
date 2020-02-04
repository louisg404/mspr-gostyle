import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import AdminScreen from '../screens/AdminScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// Début page accueil
const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Coupons',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-menu${focused ? '' : '-outline'}`
          : 'md-menu'
      }
    />
  ),
};

HomeStack.path = '';
// Fin page accueil

//Début page QR Code Scanner
const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'QR Code',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'} />
  ),
};

LinksStack.path = '';
//Fin page QR Code Scanner

//Début page Admin
const AdminStack = createStackNavigator(
  {
    Admin: AdminScreen,
  },
  config
);

AdminStack.navigationOptions = {
  tabBarLabel: 'Admin',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-finger-print${focused ? '' : '-outline'}`
          : 'md-finger-print'
      }
    />
  ),
};

AdminStack.path = '';
//Fin page QR Code Scanner


const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  AdminStack
});

tabNavigator.path = '';

export default tabNavigator;
