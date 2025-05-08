import { View, Text, Button } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }: any) {
  return (
    <View>
      <Text>Accueil</Text>
      <Button title="Aller à À propos" onPress={() => navigation.navigate('About')} />
    </View>
  );
}
