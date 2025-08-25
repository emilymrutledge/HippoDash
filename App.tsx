import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './screens/HomeScreen';
import PlayerSetupScreen from './screens/PlayerSetupScreen';
import GameBoardScreen from './screens/GameBoardScreen';
import TriviaCardScreen from './screens/TriviaCardScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';

// Navigator Instances
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Icons
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const GameBoardIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="gamepad-variant" color={color} size={size} />
);

const TrophyIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="trophy-award" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <MaterialCommunityIcons name="cog" color={color} size={size} />
);

// Bottom Tabs: Home | GameBoard | Leaderboard
function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="GameBoard"
        component={GameBoardScreen}
        options={{ tabBarIcon: GameBoardIcon }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarIcon: TrophyIcon }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator for Player Setup and Trivia Flow
function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PlayerSetup" component={PlayerSetupScreen} />
      <Stack.Screen name="TriviaCard" component={TriviaCardScreen} />
    </Stack.Navigator>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="HippoDash">
        <Drawer.Screen
          name="HippoDash"
          component={MainStack}
          options={{ drawerIcon: GameBoardIcon }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ drawerIcon: SettingsIcon }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
