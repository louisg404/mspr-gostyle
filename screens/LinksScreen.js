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
        var coupon = responseJson;

        // Appel fonctions de stockage téléphone
        _storeData(coupon);

      })
      .catch((error) => {
        // Error get data
        console.log("No data for this ID.")
      });
  }

  // Store data in device storage
  _storeData = async (coupon) => {
    try {
      // On sauvegarde la valeur du code
      await AsyncStorage.setItem(coupon.id.toString(), JSON.stringify(coupon));

    } catch (error) {
      // Error saving data
      console.log("Data non sauvegardée", error);
    }
  }

  // Get data from device storage
  // _retrieveData = async () => {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     const result = await AsyncStorage.multiGet(keys);

  //     return result.map(req => JSON.parse(req)).forEach(console.log);
      
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log("Data non récupérée", error);
  //   }
  // }

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