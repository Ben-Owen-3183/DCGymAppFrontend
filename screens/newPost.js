import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import {Icon, Switch, SpeedDial} from 'react-native-elements';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {Popup, PrimaryButton, SecondaryButton} from '../shared/basicComponents';
import Settings from '../shared/settings';
import ImagePicker from 'react-native-image-crop-picker';


function createFormData(image, postText, adminOptions){
  let imageData = null;
  if(image){
    imageData = {
      name: 'image.jpg',
      type: image.mime,
      uri: Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path,
    };
  }

  var data = new FormData();
  if(imageData !== null) data.append('image', imageData);
  data.append('post_text', postText);
  data.append('admin_options', adminOptions);
  data.append('image', imageData);
  return data;
};


async function submitPost(image, postText, adminOptions, userData){
  if(postText === '') return;

  try {
    let response = await fetch(Settings.siteUrl + '/feed/new_post/', {
        method: "POST",
        enctype: "multipart/form-data",
        headers: {
          "Authorization": "Token " + userData.token
        },
        body: createFormData(image, postText, adminOptions)
      })

    let data = response.json();
    console.log(JSON.stringify(data));
  } catch (e) {
    console.log(`Create New Post Error: ${e}`);
  }
}

const NewPost = ({userData}) => {
  const [postText, setPostText] = React.useState('');
  const [notify, setNotify] = React.useState(true);
  const [pinPost, setPinPost] = React.useState(true);
  const [pinPostTimeLimit, setPinPostTimeLimit] = React.useState(false);
  const [pinPostDays, setPinPostDays] = React.useState('1');
  const [newImage, setNewImage] = React.useState(null);
  const [correctedImageHeight, setCorrectedImageHeight] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);


  const adminOptions = {
    'notify': notify,
    'pin_post': pinPost,
    'pin_post_time_limit': pinPostTimeLimit,
    'pin_post_days': pinPostDays,
  }

  function selectImage(){
    ImagePicker.openPicker({
      width: 2000,
      height: 2000,
      cropping: false
    }).then(image => {
      var scale = Dimensions.get('window').width / image.width;
      setCorrectedImageHeight(image.height * scale);
      setNewImage(image);
    }).
    catch(e => {
      console.log(e);
    });
  }

  const confirmPostButtons = [
    {
      primary: true,
      onClick: () => {
        submitPost(newImage, postText, adminOptions, userData);
        setModalVisible(!modalVisible);
      },
      text: 'Confirm'
    },
    {
      primary: false,
      onClick: () => setModalVisible(!modalVisible),
      text: 'Cancel'
    }
  ]

  return(
    <View>
      <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} buttons={confirmPostButtons} text={'Confirm you want to upload your post'}/>

      <ScrollView style={{height: '100%', backgroundColor: GlobalColors.dcGrey}}>
        <View style={newPostStyles.view}>
          <View style={{marginBottom: 10, flexDirection: 'row'}}>
            <Text style={newPostStyles.titleText}>
              Create New post
            </Text>
          </View>
          <NewPostInput postText={postText} setPostText={setPostText} userData={userData} maxLength={2000} placeholder={'Post Text'}/>

          {
            newImage ? (
              <Image
                source={{uri: newImage.path}}
                  style={{height : correctedImageHeight}}/>
            ) : (null)
          }

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <View style={{borderRightWidth: 2, borderColor: GlobalColors.dcGrey, flex: 1}}>
              <PrimaryButton
                square={true}
                text={'Add Image'}
                onPress={() => selectImage()}
              />
            </View>
            <View style={{borderLeftWidth: 2, borderColor: GlobalColors.dcGrey, flex: 1}}>
              <PrimaryButton
                square={true}
                text={'Upload Post'}
                onPress={() => setModalVisible(true)}
              />
            </View>
          </View>

          {
            userData.is_staff || userData.is_superuser ? (
              <View
                style={{
                  borderWidth: 1,
                  marginHorizontal: 10,
                  borderColor: GlobalColors.dcYellow,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 20
                }}
              >
                <View style={{marginBottom: 20}}>
                  <Text style={[newPostStyles.text, {fontWeight: 'bold', textDecorationLine: 'underline'}]}>
                    Staff/Admin Options:
                  </Text>
                </View>

                <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                  <View style={{flex: 1}}>
                    <Text style={newPostStyles.text}>Notify Users</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Switch
                      value={notify}
                      onValueChange={(value) => setNotify(value)}
                      trackColor={{true: GlobalColors.dcYellow, false: 'light-grey'}}
                      color={GlobalColors.dcYellow}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
                  <View style={{flex: 1}}>
                    <Text style={newPostStyles.text}>Pin Post</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Switch
                      value={pinPost}
                      onValueChange={(value) => setPinPost(value)}
                      trackColor={{true: GlobalColors.dcYellow, false: 'light-grey'}}
                      color={GlobalColors.dcYellow}
                    />
                  </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1}}>
                    <Text style={newPostStyles.text}>Pinned Time Limit</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-start'}}>
                    <Switch
                      value={pinPostTimeLimit}
                      onValueChange={(value) => setPinPostTimeLimit(value)}
                      trackColor={{true: GlobalColors.dcYellow, false: 'light-grey'}}
                      color={GlobalColors.dcYellow}
                    />
                  </View>
                </View>

                {
                  pinPostTimeLimit ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{flex: 1, marginRight: 10}}>
                        <Text style={newPostStyles.text}>Days until post is not pinned</Text>
                      </View>
                      <View style={{flex: 1}}>
                        <TextInput
                          value={pinPostDays}
                          onChangeText={value => setPinPostDays(value)}
                          style={newPostStyles.input}
                          keyboardType="numeric"
                          multiline={false}
                          maxLength={100}
                          placeholder={'days'}
                          placeholderTextColor={'#afafaf'}
                        />
                      </View>
                    </View>
                  ) : (null)
                }

              </View>
            ) : (null)
          }

        </View>
      </ScrollView>
    </View>
  )
}

const NewPostInput = ({userData, maxLength, placeholder, postText, setPostText}) => {
  const userName = `${userData.first_name} ${userData.last_name}`

  /*
    <CustomAvatar
      name={userName}
      style={{marginHorizontal: 10, marginBottom: 10}}
      avatarURL={userData.avatarURL}
      size={60}
    />
  */

  return(
    <View>
      <TextInput
        value={postText}
        onChangeText={value => setPostText(value)}
        style={newPostStyles.input}
        multiline={true}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={'#afafaf'}
      />
    </View>
  )
}

export default NewPost;

const newPostStyles = StyleSheet.create({
  view: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: GlobalColors.dcGrey,
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    fontFamily : 'BebasNeue Bold',
    color: GlobalColors.dcYellow,
    fontSize: 40,
    marginBottom: 10,
    marginTop: 20
  },
  text: {
    color: GlobalColors.dcYellow,
    fontSize: 18,
  },
  input: {
    backgroundColor: GlobalColors.dcLightGrey,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: 'white',
    flex: 1,
  }
});
