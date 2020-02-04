import React, { useState, useEffect, Component } from 'react';
import { ExpoLinksView } from '@expo/samples';
import { ScrollView, Text, View, StyleSheet, Button, Alert, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as WebBrowser from 'expo-web-browser';

export default function LinksScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  let   [subscribed, setSubscribed] = useState(false);
  let   [connected, setConnected] = useState(false);
  let   [pseudo, setPseudo] = useState('');
  let   [password, setPassword] = useState('');
  let   [firstname, setFirstname] = useState('');
  let   [lastname, setLastname] = useState('');

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

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
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

  // Fonction de connexion
  connexion = async () => {
    // TODO : API call pour se connecter
    console.log("Connexion en cours...");
  }

  // Fonction d'inscription
  inscription = async (pseudo, password, firstname, lastname) => {
    // TODO : API call pour s'inscrire
    console.log("Inscription en cours...");
    console.log(pseudo, password, firstname, lastname);

    fetch(`http://192.168.43.242:8080/user/` + pseudo +`/`+ password +`/`+ firstname +`/`+ lastname);
    setSubscribed(subscribed ? false : true);
  }

  // Fonction déjà un compte
  dejaCompte = async () => {
    console.log("Déjà un compte...");
    setSubscribed(subscribed ? false : true)
  }

  // Fonction oublier de s'inscire
  oubliInscription = async () => {
    console.log("Connexion en cours...");
    setSubscribed(subscribed ? false : true);
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Si l'utilisateur est connecté
  if (connected) {
    return(
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
    )
  }

  return(
    <View>
      {!subscribed && !connected ? (
        <View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getTitleText}>S'inscrire</Text>           
          </View>
          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder={'Pseudo'}
              onChangeText={ (text) => setPseudo(text) } />
          </View>
  
          <View style={styles.inputView} >
          <TextInput  
              style={styles.inputText}
              placeholder={'Mot de passe'}
              onChangeText={ (text) => setPassword(text) } />
          </View>

          <View style={styles.inputView} >
          <TextInput  
              style={styles.inputText}
              placeholder={'Prénom'}
              onChangeText={ (text) => setFirstname(text) } />
          </View>

          <View style={styles.inputView} >
          <TextInput  
              style={styles.inputText}
              placeholder={'Nom'}
              onChangeText={ (text) => setLastname(text) } />
          </View>
  
          <TouchableOpacity style={styles.loginBtn} onPress={() => inscription(pseudo, password, firstname, lastname)}>
            <Text style={{color: "white"}}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => dejaCompte()}>
            <Text style={{color: "white"}}>Déjà un compte</Text>
          </TouchableOpacity>
        </View>
      ): subscribed && !connected ? (
        <View>
          <View style={styles.getStartedContainer}>
          <Text style={styles.getTitleText}>Se connecter</Text>           
        </View>
        <View style={styles.inputView} >
          <TextInput  
              style={styles.inputText}
              placeholder="Pseudo" 
              placeholderTextColor="black"/>
        </View>

        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Mot de passe" 
            placeholderTextColor="black"
            secureTextEntry/>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={() => setConnected(connected ? false : true)}>
          <Text style={{color: "white"}}>Valider</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => oubliInscription()}>
          <Text style={{color: "white"}}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
      ) : (null) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    marginHorizontal: 25,
  },
  getTitleText: {
    fontSize: 40,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 44,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    marginBottom: 20
  },
  // Espace de connexion
  inputView: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    justifyContent: "center",
    padding: 20,
    marginHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 100,
    shadowRadius: 3.84,
    elevation: 5
  },
  inputText:{
    color: "black"
  },
  loginBtn:{
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 50,
    marginHorizontal: 50
  },
  // Fin espace de connexion
});