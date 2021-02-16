import React, { Component} from 'react';
import {View, Text,TouchableOpacity, ImagePickerIOS, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase';
import db from '../config';
import {RFValue} from 'react-native-responsive-fontsize';

export default class CustomSidebarMenu extends Component{
  state={
    userId: firebase.auth().currentUser.email,
    image: '#',
    name: '',
    docId: ''
  }
  fetchImage=(imageName)=>{
    var storageRef = firebase.storage().ref().child("user_profiles/"+imageName);
    storageRef.getDownloadURL()
      .then((url)=>{
        this.setState({image: url})
      })
      .catch((error)=>{
        this.setState({image: '#'});
      })
  }

  uploadImage=async(uri, imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase.storage().ref().child("user_profiles/"+imageName);

    return ref.put(blob).then((response)=>{
      this.fetchImage(imageName);
    })
  }
  selectPicture=async()=>{
    const{cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if(!cancelled){
      this.uploadImage(uri, this.state.userId);
    }
  }
  getUserProfile(){
    db.collection('users').where('username', '==', this.state.userId)
      .onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image
          })
        })
      })
  }
  componentDidMount(){
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex: 0.3,justifyContent:'center', alignItems: 'center', backgroundColor: 'orange', paddingTop: RFValue(50)}}>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="xlarge"
            onPress={()=>{
              this.selectPicture();
              console.log(this.state.name);
            }}
            showEditButton
          />
          <Text style={{fontWeight: "300",fontSize: RFValue(20),color: "#fff",padding: RFValue(20),}}>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={{justifyContent:'center',padding:10,height:30,width:'100%'}}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  imageContainer : {
    flex: 0.75,
    width: '50%',
    height: '22%',
    marginLeft: 15,
    marginTop: 50,
    borderRadius: 10
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})

