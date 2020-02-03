import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity,
  Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class HomeScreen extends React.Component {
  // Constructeur
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
      value: '',
      value2: '',
      modalVisible: false,
      listCoupons: []
    };
  }

  // Changer l'état d'une modal
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount () {
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((result) => {
          var listCoupons = result.map(req => console.log(req));
          this.setState({listCoupons});
          console.log(this.state.listCoupons);
        })
      })
      
    } catch (error) {
      // Error retrieving data
      console.log("Data non récupérée", error);
    }

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

  render(){
    // Données en cours de récupération
    if (this.state.isLoading){
      return(
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    // Données de l'API récupérées
    }else{
      let movies = this.state.dataSource.map((val, key) => {
          return  <View key={key} style={styles.item}>
                    <View style={{flex:1,backgroundColor:"#fff"}}>
                      <View style={{backgroundColor:"#3E87E3", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10, marginBottom: 10, shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 100,
                        shadowRadius: 3.84,

                        elevation: 5,}}>
                        <Text style={styles.getItemText}>
                        {val.code}</Text>
                        <Text style={styles.getDescriptionText}>{val.description}</Text>
                      </View>
                    </View>
                  </View>
      });

      // Affichage du contenu lorsque tout est récupéré
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}>

            <View style={styles.getStartedContainer}>

              
              <Text style={styles.getTitleText}>Mes coupons</Text>
              {movies}

              <Text style={styles.getTitleText}>
                <Ionicons
                  name={'md-heart'}
                  size={40}
                  color={'#ED4956'}
                /> Sauvegardés</Text>

              <View style={{flex:1,backgroundColor:"#fff"}}>
                <View style={{backgroundColor:"#3E87E3", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 10, marginBottom: 10, shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 100,
                  shadowRadius: 3.84,

                  elevation: 5,}}>

                  <Text style={styles.getItemText}>{this.state.listCoupons.code}</Text>
                  <Text style={styles.getDescriptionText}>{this.state.listCoupons.description}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.buttonStyle}>
                <Text style={styles.buttonStyleText}>Actualiser</Text>
              </TouchableOpacity>              
            </View>
          </ScrollView>
        </View>
      );
    }
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
    backgroundColor: 'black',
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