import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Icon, Switch, SpeedDial} from 'react-native-elements';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {Popup, PrimaryButton, SecondaryButton} from '../shared/basicComponents';
import Settings from '../shared/settings';
import ImagePicker from 'react-native-image-crop-picker';
import {AuthContext} from '../routes/drawer';

let signOutHook;

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

  if(imageData !== null){
    data.append('image', imageData);
  }

  data.append('post_text', postText);

  for (const key in adminOptions) {
    data.append(key, adminOptions[key]);
  }

  data.append('image', imageData);
  return data;
};



const NewPost = ({userData, navigation}) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [postText, setPostText] = React.useState('');
  const [notify, setNotify] = React.useState(false);
  const [pinPost, setPinPost] = React.useState(false);
  const [pinPostTimeLimit, setPinPostTimeLimit] = React.useState(false);
  const [pinPostDays, setPinPostDays] = React.useState('1');
  const [newImage, setNewImage] = React.useState(null);
  const [correctedImageHeight, setCorrectedImageHeight] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [vimeoLink, setVimeoLink] = React.useState('');
  const [errors, setErrors] = React.useState('');
  const [posting, setPosting] = React.useState(false);

  const adminOptions = {
    'notify': notify,
    'pin_post': pinPost,
    'pin_post_time_limit': pinPostTimeLimit,
    'pin_post_days': pinPostDays,
    'video_link': vimeoLink,
  }

  async function submitPost(){
    if(postText === '') return;
    setPosting(true);
    

    try {
      setErrors('')
      let response = await fetch(Settings.siteUrl + '/feed/new_post/', {
        method: "POST",
        enctype: "multipart/form-data",
        headers: {
          "Authorization": "Token " + userData.token,
        },
        body: createFormData(newImage, postText, adminOptions)
      })

      if(response.status == 401 || response.status == 403){
      	signOutHook();
      	return;
      }
      
      let data = await response.json();
   
      if(data.success){
        setPostText('');
        setVimeoLink('');
        setNewImage('');
        setNotify(null);
        setPinPost(false);
        setPinPostDays(1);
        setPinPostTimeLimit(false);
        setNotify(false);
        setPosting(false);
        navigation.navigate('UserPosts');
      }
      else{
        setErrors(data.errors);
        throw data.errors;
      }
    } catch (e) {
      console.log(`Create New Post Error: ${e}`);
    }
    setPosting(false);
  }

  function selectImage(){
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      compressImageMaxHeight: 1000,
      compressImageMaxWidth: 1000,
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
      useLoading: true,
      onPress: () => {
        submitPost(newImage, postText, adminOptions, userData, navigation, setErrors);
        setModalVisible(!modalVisible);
      },
      text: 'Confirm'
    },
    {
      primary: false,
      onPress: () => setModalVisible(!modalVisible),
      text: 'Cancel'
    }
  ]

  return(
    <View>
      <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} buttons={confirmPostButtons} text={'Confirm you want to upload your post'}/>

      <ScrollView keyboardShouldPersistTaps={'handled'}  style={{height: '100%', backgroundColor: GlobalColors.dcGrey}}>
        <View style={newPostStyles.view}>
          <View style={{marginBottom: 10, flexDirection: 'row'}}>
            <Text style={newPostStyles.titleText}>
              Create New post
            </Text>
          </View>
          {
            errors ? (
              <Text style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 30,
                marginVertical: 10,
                marginHorizontal: 15,
                backgroundColor: '#cc0003',
                color: 'white',
              }}>
                {'ERROR: ' + errors}
              </Text>
            ) : (null)
          }
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
                  <Text style={newPostStyles.text}>Vimeo Link  </Text>
                  <View style={{flex: 1}}>
                    {
                      vimeoLink ? (
                        <Text
                        multiline={true}
                        style={{ marginHorizontal: 20, color: 'lightgrey', fontSize: 14}}>Any selected images for this post will be ignored if the vimeo link is set.</Text>
                      ) : (null)
                    }
                    <TextInput
                      value={vimeoLink}
                      onChangeText={value => setVimeoLink(value)}
                      style={newPostStyles.vimeoInput}
                      multiline={true}
                      placeholder={'Vimeo Video Link'}
                      placeholderTextColor={'#afafaf'}
                    />
                  </View>

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
      {
        posting ? (
          <View style={{
            position: 'absolute',
            backgroundColor: '#00000090',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignContent: 'center'
          }}>
            <Text style={{fontSize: 25, marginTop: 30,marginBottom: 20, textAlign: 'center', color: '#FFC300'}} >
              Uploading Post...
            </Text>
            <ActivityIndicator
              style={{
                width: '100%',
              }}
              size={60}
              color={GlobalColors.dcYellow}
            />
            
          </View>
        ) : (null)
      }

    </View>
  )
}

const NewPostInput = ({userData, maxLength, placeholder, postText, setPostText}) => {
  const userName = `${userData.first_name} ${userData.last_name}`

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
    fontWeight: Platform.OS === 'android' ? null: 'bold',
    fontFamily: Platform.OS === 'android' ? 'BebasNeue Bold': 'BebasNeue',
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
    paddingVertical: Platform.OS === 'android' ? 8 : 12,
    color: 'white',
    flex: 1,
  },
  vimeoInput: {
    backgroundColor: GlobalColors.dcLightGrey,
    paddingHorizontal: 15,
    paddingVertical: 4,

    color: 'white',
    flex: 1,
    borderRadius: 30
  }
});
