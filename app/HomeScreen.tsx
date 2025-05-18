import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
  const [screen, setScreen] = useState('home');
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [clientName, setClientName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [generatedQrData, setGeneratedQrData] = useState('');
  const [clients, setClients] = useState([
    { id: '1', name: 'Kone', Secondname: '', clim: 'Climatiseur LG' },
    { id: '2', name: 'Dosso', clim: 'Climatiseur Samsung' },
    { id: '4', name: 'Soumahoro', clim: 'Climatiseur Illux' },
    { id: '5', name: 'keita', clim: 'Climatiseur Panasonic' },
    { id: '6', name: 'Kouamé', clim: 'Climatiseur Daikin' },
    { id: '7', name: 'Asso', clim: 'Climatiseur Mitsubishi' },
    { id: '8', name: 'Akissi', clim: 'Climatiseur Hisense' },
    { id: '9', name: 'yao', clim: 'Climatiseur Gree' },
    { id: '10', name: 'nguessan', clim: 'Climatiseur TCL' },
    { id: '11', name: 'Kouame', clim: 'Climatiseur Midea' },
  ]);

  // Demande de permission pour la caméra
  useEffect(() => {
    if (screen === 'scan' && !permission) {
      requestPermission();
    }
  }, [screen, permission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setQrData(data);
    try {
      const parsedData = JSON.parse(data);
      setClientName(parsedData.clientName || '');
      setBrand(parsedData.brand || '');
      setModel(parsedData.model || '');
      setSerialNumber(parsedData.serialNumber || '');
      setModalVisible(true);
    } catch {
      Alert.alert('QR Code scanné', `Données : ${data}`);
    }
  };

  const handleAddClient = () => {
    if (clientName && brand && model) {
      const newClient = {
        id: Date.now().toString(),
        name: clientName,
        Secondname: '',
        clim: `Climatiseur ${brand} ${model}`,
        serialNumber,
      };
      setClients([...clients, newClient]);
      // Generate QR code data
      const qrData = JSON.stringify({
        clientName,
        brand,
        model,
        serialNumber,
      });
      setGeneratedQrData(qrData);
      setClientName('');
      setBrand('');
      setModel('');
      setSerialNumber('');
      setModalVisible(false);
      setQrModalVisible(true); // Show QR code modal
      Alert.alert('Succès', 'Climatiseur enregistré avec succès');
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
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
                  {/* {item.serialNumber && (
                    <Text style={styles.clim}>Numéro de série: {item.serialNumber}</Text>
                  )} */}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.clim}>Aucun client enregistré</Text>}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(true)}
            >
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
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
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
      <View style={styles.content}>
        {renderContent()}

        {/* Modal for air conditioner registration */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enregistrer un climatiseur</Text>

              <TextInput
                style={styles.input}
                placeholder="Nom du client"
                value={clientName}
                onChangeText={setClientName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Marque"
                value={brand}
                onChangeText={setBrand}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Modèle"
                value={model}
                onChangeText={setModel}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Numéro de série (optionnel)"
                value={serialNumber}
                onChangeText={setSerialNumber}
                autoCapitalize="characters"
              />

              <TouchableOpacity style={styles.button} onPress={handleAddClient}>
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff4444' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for displaying generated QR code */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={qrModalVisible}
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>QR Code Généré</Text>
              {generatedQrData ? (
                <QRCode
                  value={generatedQrData}
                  size={200}
                  backgroundColor="#fff"
                  color="#000"
                />
              ) : (
                <Text>Aucune donnée QR à afficher</Text>
              )}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff4444', marginTop: 20 }]}
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});