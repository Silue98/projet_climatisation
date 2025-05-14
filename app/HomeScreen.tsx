import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera'; // Utilisation de useCameraPermissions

export default function LoginScreen() {
  const [screen, setScreen] = useState('home');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');
  const [permission, requestPermission] = useCameraPermissions(); // Hook pour gérer les permissions
  const cameraRef = useRef(null);

  const clients = [
    { id: '1', name: 'Client A', clim: 'Climatiseur LG' },
    { id: '2', name: 'Client B', clim: 'Climatiseur Samsung' },
    { id: '4', name: 'Client C', clim: 'Climatiseur Illux' },
    { id: '5', name: 'Client D', clim: 'Climatiseur Panasonic' },
    { id: '6', name: 'Client E', clim: 'Climatiseur Daikin' },
    { id: '7', name: 'Client F', clim: 'Climatiseur Mitsubishi' },
    { id: '8', name: 'Client G', clim: 'Climatiseur Hisense' },
    { id: '9', name: 'Client H', clim: 'Climatiseur Gree' },
    { id: '10', name: 'Client I', clim: 'Climatiseur TCL' },
    { id: '11', name: 'Client J', clim: 'Climatiseur Midea' },
  ];

  // Demande de permission pour la caméra
  useEffect(() => {
    if (screen === 'scan' && !permission) {
      requestPermission();
    }
  }, [screen, permission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
  setScanned(true);
  setQrData(data);
  Alert.alert('QR Code scanné', `Données : ${data}`);
};

  const renderContent = () => {
    switch (screen) {
      case 'home':
        return (
          <>
            <Text style={styles.title}>Liste des Clients</Text>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.client}>{item.name}</Text>
                  <Text style={styles.clim}>{item.clim}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.button}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Enregistrer un climatiseur</Text>
            </TouchableOpacity>
          </>
        );

      case 'scan':
        if (!permission) {
          return <Text>Demande de permission pour la caméra...</Text>;
        }

        if (!permission.granted) {
          return (
            <View style={styles.container}>
              <Text style={{ textAlign: 'center' }}>
                L'accès à la caméra est requis pour scanner un QR code.
              </Text>
              <TouchableOpacity onPress={requestPermission} style={styles.button}>
                <Text style={styles.buttonText}>Autoriser la caméra</Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back" // Utilisation de 'facing' au lieu de 'type'
              barcodeScannerSettings={{
                barcodeTypes: ['qr'], // Spécifier le type de code à scanner
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              ref={cameraRef}
            />
            {scanned && (
              <TouchableOpacity
                onPress={() => setScanned(false)}
                style={[styles.button, { margin: 16, alignSelf: 'center' }]}
              >
                <Text style={styles.buttonText}>Scanner à nouveau</Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case 'historique':
        return <Text style={styles.title}>📄 Historique des interventions (à implémenter)</Text>;

      case 'settings':
        return <Text style={styles.title}>⚙️ Paramètres (à implémenter)</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>

      {/* Barre de navigation en bas */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setScreen('home')} style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color={screen === 'home' ? '#0077cc' : '#888'} />
          <Text style={styles.navText}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('scan')} style={styles.navItem}>
          <Ionicons name="qr-code-outline" size={24} color={screen === 'scan' ? '#0077cc' : '#888'} />
          <Text style={styles.navText}>Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('historique')} style={styles.navItem}>
          <Ionicons name="time-outline" size={24} color={screen === 'historique' ? '#0077cc' : '#888'} />
          <Text style={styles.navText}>Historique</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('settings')} style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color={screen === 'settings' ? '#0077cc' : '#888'} />
          <Text style={styles.navText}>Paramètres</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  client: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clim: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#0077cc',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
});