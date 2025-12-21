import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Import screens (will be created)
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Client/HomeScreen';
import CreateMissionScreen from '../screens/Client/CreateMissionScreen';
import MissionDetailsScreen from '../screens/Common/MissionDetailsScreen';
import ChatScreen from '../screens/Common/ChatScreen';
import ProfileScreen from '../screens/Common/ProfileScreen';
import ProviderHomeScreen from '../screens/Provider/ProviderHomeScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const ProviderTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ProviderHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AdminTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Show loading screen
  }

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={
              user.role === 'ADMIN'
                ? AdminTabs
                : user.role === 'PROVIDER'
                ? ProviderTabs
                : ClientTabs
            }
            options={{ headerShown: false }}
          />
          <Stack.Screen name="CreateMission" component={CreateMissionScreen} />
          <Stack.Screen name="MissionDetails" component={MissionDetailsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
