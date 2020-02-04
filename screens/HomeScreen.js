import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class HomeScreen extends React.Component {
  // Constructeur
  constructor(props){
    super(props);
    this.state = {
      listCoupons: [],
      refreshing: false
    };
  }

  componentDidMount () {
    // Récupérer les données au démarrage
    this.getData();
  }

  // Récupérer tous les coupons de l'AsyncStorage
  getData() {
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((result) => {
          var listCoupons = result.map(req => req);
          this.setState({listCoupons});
        })
      })
      
    } catch (error) {
      // Error retrieving data
      console.log("Data non récupérée", error);
    }
  }

  // Supprimer toutes les données de l'AsyncStorage
  clearAllData() {
    AsyncStorage.clear();
  }

  // Rafraichir la vue de l'AsyncStorage
  _onRefresh() {
    this.getData();
    this.setState({refreshing: false});
  }

  render(){
    // View du GET AsyncStorage (tous les coupons sauvegardés)
    let coupons = this.state.listCoupons.map((val, key) => {
        // On parse la chaine de caractères en JSON
        const obj = JSON.parse(val[1]);

        // TODO : Si on trouve une valeur quelconque...
        if(val[1]){}
        
        // View d'une carte d'informations correspondant à un coupon
        return  <View key={key} style={styles.item}>
                  <View style={styles.cards}>
                    <Text style={styles.getItemText}>
                    {obj.code}</Text>
                    <Text style={styles.getDescriptionText}>{obj.description}</Text>
                    <Text style={styles.getDescriptionText}>ID scanné : {val[0]}</Text>
                  </View>
                </View>
    });

    // Affichage du contenu lorsque tout est récupéré
    return (
      <View style={styles.container}>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getTitleText}>
              <Ionicons name={'md-heart'} size={40} color={'#ED4956'}/> Sauvegardés
            </Text>
            {coupons}

            <TouchableOpacity style={styles.buttonStyle} onPress={this.clearAllData}>
              <Text style={styles.buttonStyleText}>Tout supprimer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
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
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
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
  welcomeImage: {
    width: 250,
    height: 500,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    marginHorizontal: 25,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  buttonStyle: {
    padding: 20,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    marginHorizontal: 50
  },
  buttonStyleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'left',
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
export default HomeScreen;