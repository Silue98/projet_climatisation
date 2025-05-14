// // App.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './LoginScreen';
// import HomeScreen from './HomeScreen';

// // Définir les types pour les routes
// export type RootStackParamList = {
//   Login: undefined;
//   Home: undefined;
// };

// const Stack = createStackNavigator<RootStackParamList>();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
