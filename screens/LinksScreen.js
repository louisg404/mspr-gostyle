import React, { useState, useEffect } from 'react';
import { ExpoLinksView } from '@expo/samples';
import { ScrollView, Text, View, StyleSheet, Button, Alert, AsyncStorage } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as WebBrowser from 'expo-web-browser';

export default function LinksScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Get coupon and it's description from local API
  getCoupon = async (data) => {
    fetch(`http://192.168.43.242:8080/coupon/` + data)
      .then((response) => response.json())
      .then((responseJson) => {
        var code = responseJson.code;
        var description = responseJson.description;

        // Appel fonctions de stockage téléphone
        _retrieveData();
        _storeData(code, description);

      })
      .catch((error) => {
        // Error get data
        console.log("No data for this ID.")
      });
  }

  // Store data in device storage
  _storeData = async (code, description) => {
    try {
      // On sauvegarde la valeur du code
      await AsyncStorage.setItem('code', code);
      // On sauvegarde la valeur de la description
      await AsyncStorage.setItem('description', description);

    } catch (error) {
      // Error saving data
      console.log("Data non sauvegardée");
    }
  }

  // Get data from device storage
  _retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem('code');
      var value2 = await AsyncStorage.getItem('description');
      
      if (value !== null && value2 !== null) {
          // Our data is fetched successfully
          console.log("Valeur sauvegardée dans le storage : " + value + " et " + value2);
      }
    } catch (error) {
      // Error retrieving data
      console.log("Data non récupérée");
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // this.props.navigation.navigate('Home');
    Alert.alert(
      'Scan',
      data,
      [
        {text: 'OK'}
      ],
      {cancelable: false},
    );
    
    // Appel API
    getCoupon(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}