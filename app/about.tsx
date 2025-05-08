import { View, Text, Button } from 'react-native';
import React from 'react';

export default function AboutScreen({ navigation }: any) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'À propos',
      headerRight: () => (
        <Button
          onPress={() => alert('Bouton Navbar')}
          title="Info"
          color="#00cc00"
        />
      ),
    });
  }, [navigation]);

  return (
    <View>
      <Text>Page About</Text>
      <Button title="Retour à l'accueil" onPress={() => navigation.goBack()} />
    </View>
  );
}
