import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  AsyncStorage
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class AdminScreen extends React.Component {
  // Constructeur
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      refreshing: false,
      admin: ''
    };
  }

  componentDidMount () {
    this.getData();
    this.getAdmin();
  }

  // Récupérer l'état administrateur
  getAdmin = async () => {
    try {
      const adm = await AsyncStorage.getItem('admin');
      console.log("Administrateur : ", adm);
      // Attribution de l'état administrateur
      this.setState({
        admin: adm
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Récupérer tous les coupons
  getData() {
    return fetch('http://192.168.43.242:8080/coupon')
      .then ( (response) => response.json() )
      .then( (responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson
        });
      })

      .catch((error) => {
        console.log(error)
      });
  }

  // Rafraichir la vue
  _onRefresh() {
    this.getData();
    this.setState({refreshing: false});
  }

  render(){
    // Données en cours de récupération, affichage d'un loader
    if (this.state.isLoading){
      return(
        <View>
          <ActivityIndicator />
        </View>
      )
    // Données de l'API récupérées
    }else{
      // View du GET all coupons
      let movies = this.state.dataSource.map((val, key) => {
          return  <View key={key} style={styles.item}>
                    <View style={styles.cards}>
                      <Text style={styles.getItemText}>
                      {val.code}</Text>
                      <Text style={styles.getDescriptionText}>{val.description}</Text>
                    </View>
                  </View>
      });

      // Affichage du contenu lorsque tout est récupéré
      if (this.state.admin === 'true') {
        return (
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                /> } >

              <View style={styles.getStartedContainer}>
                <Text style={styles.getTitleText}>Tous les coupons</Text>
                {movies}
              </View>
            </ScrollView>
          </View>
        );
      }else{
        return (
          <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                /> } >

                <View style={styles.getStartedContainer}>
                  <Text style={styles.getTitleText}>Accès refusé</Text>
                </View>
            </ScrollView>
          </View>
        );
      }
    }
  }
}

AdminScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  // Espace de connexion
  inputView: {
    backgroundColor: "grey",
    borderRadius: 10,
    marginBottom: 5,
    justifyContent: "center",
    padding: 20,
    marginHorizontal: 25
  },
  inputText:{
    color: "white"
  },
  loginBtn:{
    marginHorizontal: 25,
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  // Fin espace de connexion
  cards: {
    backgroundColor:"#3E87E3",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 100,
    shadowRadius: 3.84,
    elevation: 5
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
  getItemText: {
    fontSize: 22,
    color: 'rgba(96,100,109, 1)',
    marginTop: 10,
    textAlign: 'left',
    color: 'white',
    fontWeight: 'bold',
  },
  getDescriptionText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    marginBottom: 10,
    textAlign: 'left',
    color: 'white',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
});
export default AdminScreen;