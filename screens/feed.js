import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  Dimensions,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {PrimaryButton, UsersName, Popup} from '../shared/basicComponents';
import Settings from '../shared/settings';
import {BoxShadow} from 'react-native-shadow'
import Storage from '../shared/storage';
import { useFocusEffect } from '@react-navigation/native';
import Image from 'react-native-scalable-image';
import moment from 'moment'
import {AuthContext} from '../routes/drawer';

const windowWidth = Dimensions.get('window').width;
const hideCommentsValue = 3;
const hideRepliesValue = 0;

let signOutHook;

async function likePostElement(userData, likeType, id, posts, setPosts, userFeed){

  try {
    let urlEnd = ''
    if(likeType === 'post') urlEnd = '/feed/like_post/';
    else if(likeType === 'comment') urlEnd = '/feed/like_comment/';
    else if(likeType === 'reply') urlEnd = '/feed/like_reply/';
    else throw `likeType "${likeType}" not recognised`;

    let response = await fetch(Settings.siteUrl + urlEnd, {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({id: id})
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()

    if(data.post)
      setPostLike(data.post, posts, setPosts, userFeed);
    else if(data.comment)
      setCommentLike(data.comment, posts, setPosts, userFeed);
    else if(data.reply)
      setReplyLike(data.reply, posts, setPosts, userFeed);
    else if(data.errors)
      throw `server errors: ${data.errors}`
    else
      throw 'server response not recognised'

  } catch (e) {
    console.log("Like Post Element: " + e);
  }
}

async function setPostLike(post, posts, setPosts, userFeed){

  for (var i = 0; i < posts.length; i++) {
    if(posts[i].id.toString() === post.id.toString()){
      let newPosts = []
      Object.assign(newPosts, posts);
      newPosts[i] = post;
      setPosts(newPosts);
      storePosts(newPosts, userFeed);
      return;
    }
  }

  throw 'Failed to find post to update like';
}

async function setCommentLike(comment, posts, setPosts, userFeed){

  for (var i = 0; i < posts.length; i++) {
    if(posts[i].id.toString() === comment.post_id.toString()){
      for (var j = 0; j < posts[i].comments.length; j++) {
        if(posts[i].comments[j].id.toString() === comment.id.toString()){
          let newPosts = []
          Object.assign(newPosts, posts);
          newPosts[i].comments[j] = comment;
          setPosts(newPosts);
          storePosts(newPosts, userFeed);
          return;
        }
      }
    }
  }

  throw 'Failed to find comment to update like';
}

async function setReplyLike(reply, posts, setPosts, userFeed){

  for (var i = 0; i < posts.length; i++) {
    if(posts[i].id.toString() === reply.post_id.toString()){
      for (var j = 0; j < posts[i].comments.length; j++) {
        if(posts[i].comments[j].id.toString() === reply.comment_id.toString()){
          for (var k = 0; k < posts[i].comments[j].replies.length; k++) {
            if(posts[i].comments[j].replies[k].id.toString() === reply.id.toString()){
              let newPosts = [];
              Object.assign(newPosts, posts);
              reply.new = true;
              newPosts[i].comments[j].replies[k] = reply;
              setPosts(newPosts);
              storePosts(newPosts, userFeed);
              return;
            }
          }
        }
      }
    }
  }

  throw 'Failed to find reply to update like';
}

async function fetchPosts(userData, userFeed){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/get_posts/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({user_posts_only: userFeed})
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()
    return data;
  } catch (e) {
    console.log("Fetch Posts: " + e);
  }
}

async function storePosts(posts, userFeed){
  let postsToStore = [];
  let loopRange = posts.length > 5 ? 5 : posts.length;
  for (var i = 0; i < loopRange; i++) {
    postsToStore[i] = posts[i]
  }
  if(!userFeed)
    Storage.set('posts', postsToStore);
}

async function fetchPostsBefore(post, userData, userFeed){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/get_posts_before/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        datetime: post.timestamp,
        post_id: post.id,
        user_posts_only: userFeed,
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()
    return data;
  } catch (e) {
    console.log("Fetch Posts Before: " + e);
  }
}

async function uploadComment(userData, commentText, post_id, posts, setPosts){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/new_post_comment/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        post_id: post_id,
        text: commentText
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()
    if(data.comment){
      addCommentToPosts(posts, setPosts, data.comment, post_id);
    }


  } catch (e) {
    console.log("Upload comment: " + e);
  }
}

async function uploadReply(userData, replyText, post_id, comment_id, posts, setPosts){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/new_comment_reply/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        post_id: post_id,
        comment_id: comment_id,
        text: replyText
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()
    if(data.reply){
      addReplyToPosts(posts, setPosts, data.reply);
    }

  } catch (e) {
    console.log("Upload reply: " + e);
  }
}

async function addReplyToPosts(posts, setPosts, reply){
  for (var i = 0; i < posts.length; i++) {
    if(posts[i].id.toString() === reply.post_id.toString()){
      let comments = posts[i].comments;
      for (var j = 0; j < comments.length; j++) {
        if(comments[j].id.toString() === reply.comment_id.toString()){
          let newPosts = [];
          Object.assign(newPosts, posts);

          let newReplies = [];
          Object.assign(newReplies, posts[i].comments[j].replies)
          reply.new = true;
          newPosts[i].comments[j].replies = [reply].concat(newReplies);

          setPosts(newPosts);
          storePosts(newPosts);
          return;
        }
      }
    }
  }

  throw 'addReplyToPosts(): Failed to find post or comment to add new reply';
}

function addCommentToPosts(posts, setPosts, comment, postId){
  let newPostsArray = [];
  Object.assign(newPostsArray, posts);

  for (var i = 0; i < newPostsArray.length; i++) {
    if(newPostsArray[i].id.toString() === postId.toString()){
      let newComments = []
      newComments.push(comment);
      newComments = newComments.concat(newPostsArray[i].comments);
      newPostsArray[i].comments = newComments;
      setPosts([].concat(newPostsArray));
      storePosts(newPostsArray);
      return;
    }
  }

  throw 'addCommentToPosts(): Failed to find post to add new post';
}

async function togglePinnedPost(userData, setPosts, posts, post_id, userFeed){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/pin_post/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        post_id: post_id,
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()

    if(data.post){
      let newPosts = [];
      Object.assign(newPosts, posts);
      for (var i = 0; i < posts.length; i++)
        if(posts[i].id.toString() === post_id.toString())
          newPosts[i] = data.post;
      setPosts(newPosts);
      storePosts(posts, userFeed);
    }

  } catch (e) {
    console.log("Pinned Post: " + e);
  }
}

async function deletePost(userData, setPosts, posts, post_id, userFeed){
  try {
    let response = await fetch(Settings.siteUrl + '/feed/delete_post/', {
      method: "POST",
      headers: {
        "Authorization": "Token " + userData.token,
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        post_id: post_id,
      })
    })

    if(response.status == 401 || response.status == 403){
      signOutHook();
      return;
    }

    let data = await response.json()

    if(data.success){
      let newPosts = [];
      for (var i = 0; i < posts.length; i++)
        if(posts[i].id.toString() !== post_id.toString()){
          newPosts.push(posts[i]);
        }

      setPosts(newPosts);
      storePosts(posts, userFeed);
    }

  } catch (e) {
    console.log("Delete Post: " + e);
  }
}

function postExists(post_id, posts){
  for (var i = 0; i < posts.length; i++)
    if(posts[i].id.toString() === post_id.toString())
      return true;
  return false;
}

/*merges new posts to beggining of posts array*/
function mergeNewPosts(oldPosts, newPosts){
  if(oldPosts.length === 0) return newPosts;
  let postsToConcat = [];
  let mostRecentOldPostId = oldPosts[0].id;

  for (var i = 0; i < newPosts.length; i++) {
    if(newPosts[i].id.toString() === mostRecentOldPostId.toString()){
      oldPosts = updatePost(oldPosts, newPosts)
      break;
    }
    else if(!postExists(newPosts[i].id, oldPosts)){
      postsToConcat.push(newPosts[i]);
    }
  }
  return postsToConcat.concat(oldPosts);
}

function updatePost(oldPosts, newPosts){
  for (var i = 0; i < oldPosts.length; i++) {
    for (var j = 0; j < newPosts.length; j++) {
      if(oldPosts[i].id.toString() === newPosts[j].id.toString()){
        oldPosts[i] = newPosts[j];
      }
    }
  }
  return oldPosts;
}

/*merges old posts to end of posts array*/
function mergeOldPosts(oldPosts, newPosts){
  if(oldPosts.length === 0) return newPosts;
  let oldestPostId = oldPosts[oldPosts.length - 1].toString();
  let postsToConcat = [];

  let idFound = false;
  for (var i = 0; i < newPosts.length; i++) {
    if(newPosts[i].id.toString() === oldestPostId)
      idFound = true;
    if(idFound)
      postsToConcat.append(newPosts[i])
  }

  if(postsToConcat.length === 0)
    return oldPosts.concat(newPosts);
  return oldPosts.concat(postsToConcat);
}

const Feed = ({userData, navigation, userFeed}) => {
  const { signOut } = React.useContext(AuthContext);
  signOutHook = signOut;
  const [viewHeight, setViewHeight] = React.useState(0);
  const [posts, setPosts] = React.useState([]);
  const [usingOldData, setUsingOldData] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        try{
          if(posts.length <= 5) return;

          let newPosts = [];
          for (var i = 0; i < 5; i++)
            newPosts[i] = posts[i]
          setPosts(newPosts);
        }
        catch(e){ console.log('useFocusEffect failed to trim posts data')}
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function loadPosts(){
        try {
          let old_posts_data;

          if(posts.length == 0){
            if(!userFeed)
              old_posts_data = await Storage.get('posts');
            if(old_posts_data) setPosts(old_posts_data);
          }

          let posts_data = await fetchPosts(userData, userFeed);

          if(posts_data && posts_data.posts){
            // if the data used was from cache overrite it
            if(usingOldData){
              setPosts(posts_data.posts);
            }
            // else if the data is fresh, merge new posts with existing data
            else{
              let mergedPosts = mergeNewPosts(posts, posts_data.posts);
              setPosts(mergedPosts);
            }
            setUsingOldData(false);
            storePosts(posts_data.posts, userFeed);
          }
        } catch (e) {
          console.log('Feed useFocusEffect: ' + e);
        }
      }

      loadPosts();
    }, [])
  );

  return (
    <View
      style={{backgroundColor: GlobalColors.dcLightGrey, flex: 1}}
      onLayout={event => setViewHeight(event.nativeEvent.layout.height)}>
      <Posts
        navigation={navigation}
        userFeed={userFeed}
        posts={posts}
        setPosts={setPosts}
        userData={userData}
        mainViewHeight={viewHeight}
      />
      <FeedMenu navigation={navigation} mainViewHeight={viewHeight}/>
    </View>
  );
}

const FeedMenu = ({mainViewHeight, navigation, posts, setPosts}) => {
  const [viewWidth, setViewWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  if(isKeyboardVisible) return null;

  const shadowOpt = {
    width:60,
    height:60,
    color:"#000",
    border:2,
    radius:30,
    opacity:0.2,
    x:-2,
    y:2,
    style:{marginVertical:5}
  }

  const subShadowOpt = {
    width:50,
    height:50,
    color:"#000",
    border:1,
    radius:25,
    opacity:0.2,
    x:-2,
    y:2,
    style:{marginVertical:5}
  }

  function setValues(event){
    let width = event.nativeEvent.layout.width;
    let height = event.nativeEvent.layout.height;
    setViewWidth(width);
    setViewHeight(height);
  }

  return(
    <View
      onLayout={event => {
        setValues(event);
      }}
      style={{
        position: 'absolute',
        padding: -0,
        right: 0,
        top: mainViewHeight - viewHeight - 25,
        marginRight: 25,
        alignItems: 'center'

    }}>
      {
        menuOpen ? (
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
              <View
                style={{
                  borderRadius: 20,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: '#000000B0',
                  position: 'absolute',
                  right: 60,
                }}>
                <Text style={{color: GlobalColors.dcYellow, fontSize: 18}}>Feed</Text>
              </View>
              <BoxShadow setting={subShadowOpt}>
                <View style={{
                  borderRadius: 300,
                  borderColor: GlobalColors.dcYellow,
                  backgroundColor: GlobalColors.dcGrey,
                  borderWidth: 1,
                  width:50,
                  height:50,
                  justifyContent: 'center',
                }}>
                  <Icon
                    containerStyle={{marginVertical: 0}}
                    name='users'
                    type='font-awesome-5'
                    size={20}
                    color={GlobalColors.dcYellow}
                    onPress={() => {
                      navigation.navigate('Feed');
                      setMenuOpen(false);
                    }}/>
                </View>
              </BoxShadow>
            </View>


            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
              <View
                style={{
                  borderRadius: 20,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: '#000000B0',
                  position: 'absolute',
                  right: 60,
                }}>
                <Text style={{color: GlobalColors.dcYellow, fontSize: 18}}>Create New Post</Text>
              </View>
              <BoxShadow setting={subShadowOpt}>
                <View style={{
                  borderRadius: 300,
                  borderColor: GlobalColors.dcYellow,
                  backgroundColor: GlobalColors.dcGrey,
                  borderWidth: 1,
                  width:50,
                  height:50,
                  justifyContent: 'center',
                }}>
                  <Icon
                    containerStyle={{marginVertical: 0}}
                    type='font-awesome-5'
                    name='plus'
                    size={20}
                    color={GlobalColors.dcYellow}
                    onPress={() => {
                      navigation.navigate('NewPost');
                      setMenuOpen(false);
                    }}/>
                </View>
              </BoxShadow>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
              <View
                style={{
                  borderRadius: 20,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: '#000000B0',
                  position: 'absolute',
                  right: 60,
                }}
              >
                <Text style={{color: GlobalColors.dcYellow, fontSize: 18}}>Your Posts</Text>
              </View>
              <BoxShadow setting={subShadowOpt}>
                <View style={{
                  borderRadius: 300,
                  borderColor: GlobalColors.dcYellow,
                  backgroundColor: GlobalColors.dcGrey,
                  borderWidth: 1,
                  width:50,
                  height:50,
                  justifyContent: 'center',
                }}>
                  <Icon
                    containerStyle={{marginVertical: 0}}
                    type='font-awesome-5'
                    name='user'
                    size={20}
                    color={GlobalColors.dcYellow}
                    onPress={() => {
                      navigation.navigate('UserPosts');
                      setMenuOpen(false);
                    }}
                    />
                </View>
              </BoxShadow>
            </View>
          </View>
        ) : (null)
      }

      <BoxShadow setting={shadowOpt}>
        <View style={{
          borderRadius: 300,
          borderColor: GlobalColors.dcYellow,
          backgroundColor: GlobalColors.dcGrey,
          borderWidth: 1,
          width:60,
          height:60,
          justifyContent: 'center',
        }}>
          <Icon
            containerStyle={{marginVertical: 0}}
            type='font-awesome-5'
            name={(menuOpen ? 'minus' : 'plus')}
            size={25}
            color={GlobalColors.dcYellow}
            onPress={() => setMenuOpen(!menuOpen)}
            />
        </View>
      </BoxShadow>
    </View>
  );
}

const Posts = ({userData, posts, setPosts, userFeed, viewHeight, navigation}) => {
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [firstEndReachCall, setFirstEndReachCall] = React.useState(true);
  const [newContentLoaded, setNewContentLoaded] = React.useState(false);
  const [postLengths, setPostLengths] = React.useState({prev: 0, now: 0, item: null});
  const flatlistRef = React.useRef(null);


  // Works, but have no idea why do not touch
  // Handles to scroll to new content on new content load
  React.useEffect(() => {
    if(newContentLoaded && postLengths.prev < postLengths.now && postLengths.item != null){
      let avg = flatlistRef.current._listRef._averageCellLength;
      let totalOffset = avg * postLengths.prev;
      flatlistRef.current.scrollToOffset({offset: totalOffset})
      setNewContentLoaded(false);
    }
  }, [posts]);

  async function onPostsEndReached(){
  
    try {
      if(firstEndReachCall){
        setFirstEndReachCall(false);
        return;
      }

      setLoadingHistory(true);
      let newPostsData = await fetchPostsBefore(posts[posts.length - 1], userData, userFeed);

      if(newPostsData && newPostsData.posts && newPostsData.posts.length > 0){
        let newPosts = mergeOldPosts(posts, newPostsData.posts);
        if(newPosts.length === posts.length) return;

        newPosts[posts.length]
        setPostLengths({
          prev: posts.length,
          now: newPosts.length,
          item: newPosts[posts.length]
        });
        setNewContentLoaded(true)
        setPosts(newPosts);
      }
      else{
        throw 'no posts returned';
      }
    } catch (e) {
      console.log(`End Post Reached: ${e}`)
    }
    setLoadingHistory(false);
  }

  const renderItem = ({ item }) => {
    return (
      item ?
      <Post navigation={navigation} posts={posts} setPosts={setPosts} userData={userData} post={item} userFeed={userFeed}/>
      :
      <View style={{marginVertical: 100}}></View>
    );
  };

  return(
    <View>
      <FlatList
        removeClippedSubviews={false}
        keyboardShouldPersistTaps={'handled'}
        ref={flatlistRef}
        data={posts.concat([null])}
        onEndReached={() => onPostsEndReached()}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        keyExtractor={
          (item) => {
            if(item) return item.id;
            return -1;
        }}
      />

      {
        loadingHistory ?
        <LoadingSpinner mainViewHeight={viewHeight}/>
        :
        null
      }
    </View>

  )
}

const LoadingSpinner = ({mainViewHeight}) => {
  const [viewWidth, setViewWidth] = React.useState(0);
  const windowWidth = Dimensions.get('window').width;

  function setValues(event){
    let width = event.nativeEvent.layout.width;
    setViewWidth(width);
  }
  return(
    <View>
      <ActivityIndicator
        onLayout={event => { setValues(event) }}
        style={{
          position: 'absolute',
          padding: -0,
          right: (windowWidth / 2) - (viewWidth / 2),
          top: -80,
          marginRight: 0,
          alignItems: 'center'
        }}
        size={60}
        color={GlobalColors.dcYellow}
      />
    </View>
  )
}

const PostMenu = ({userData, post, postMenuToggle, setPostMenuToggle, posts, setPosts, userFeed}) => {

  const buttons = [
    {
      text: (post.pinned ? 'Unpin Post' : 'Pin Post'),
      useLoading: true,
      primary: true,
      onPress: async () => {
        await togglePinnedPost(userData, setPosts, posts, post.id, userFeed);
      },
    },
    {
      text: 'Delete Post',
      useLoading: true,
      primary: true,
      onPress: async () => {
        await deletePost(userData, setPosts, posts, post.id, userFeed);
      },
      confirm: 'Are you sure you want to delete this post?'
    },
    {
      text: 'Cancel',
      primary: false,
      onPress: () => {
        setPostMenuToggle(false);
      },
    }
  ]

  return (
    <Popup
      buttons={buttons}
      text={'Post Options:'}
      setModalVisible={setPostMenuToggle}
      modalVisible={postMenuToggle}
    />
  )
}

const Post = ({userData, post, posts, setPosts, userFeed, navigation}) => {
  const defaultMaxNumberOfLine = 6;
  const [numberOfLines, setNumberOfLines] = React.useState(null);
  const [maxNumberOfLines, setMaxNumberOfLines] = React.useState(defaultMaxNumberOfLine);
  const [showCommentSection, setShowCommentSection] = React.useState(post.comments.length > 0);
  const [postMenuToggle, setPostMenuToggle] = React.useState(false);
  const [imageViewWidth, setImageViewWidth] = React.useState(0);
  const [imageViewHeight, setImageViewHeight] = React.useState(0);
  const [iconWidth, setIconWidth] = React.useState(0);
  const [iconHeight, setIconHeight] = React.useState(0);

  let datetimeText = moment(post.timestamp).fromNow();
  // moment keeps printing 'in a few seconds' when it should be 'a few seconds ago'.
  if(datetimeText === 'in a few seconds')
    datetimeText = 'a few seconds ago';

  function onLayout(textLayoutEvent){
    if(numberOfLines) return;
    let numLine = textLayoutEvent.nativeEvent.lines.length;
    setNumberOfLines(numLine);
  }

  function readMore(){
    setMaxNumberOfLines(numberOfLines);
  }

  function showLess(){
    setMaxNumberOfLines(defaultMaxNumberOfLine);
  }

  function setImageWidthHeight(layout){
    // if(imageViewWidth || imageViewHeight) return;
    let viewSize = layout.nativeEvent.layout;
    setImageViewWidth(viewSize.width);
    setImageViewHeight(viewSize.height);
  }

  function setIconWidthHeight(layout){
    if(iconWidth || iconHeight) return;
    let iconSize = layout.nativeEvent.layout;
    setIconWidth(iconSize.width);
    setIconHeight(iconSize.height);
  }

  const name = `${post.user.fName} ${post.user.sName}`;

  return(
    <View style={styles.post}>
      {
        postMenuToggle ?
        <PostMenu
          userFeed={userFeed}
          userData={userData}
          post={post}
          postMenuToggle={postMenuToggle}
          setPostMenuToggle={setPostMenuToggle}
          posts={posts}
          setPosts={setPosts}
        />
        :
        null
      }
      <View style={styles.postHeader}>
        <View style={styles.postUserHeader}>
          <CustomAvatar lightColour={true} name={name} avatarURL={post.user.avatarURL}/>
          <View style={{marginHorizontal: 5}}></View>
          <UsersName
            isStaff={post.user.isStaff}
            isSuperUser={post.user.isSuperUser}
            fName={post.user.fName}
            sName={post.user.sName}
            fontSize={22}/>
          <View style={{flex: 1}}></View>
          <Text style={textStyles.chatText}>
            {datetimeText}
          </Text>
          <View style={{marginRight: 15}}></View>
          <View style={{flexDirection: 'row'}}>
            {
              post.pinned ?
              <Icon
                style={{marginHorizontal: 10}}
                name='pin'
                type='octicon'
                size={25}
                color='#FFC300'/>
              :
              null
            }
            {
              userData.is_staff || userData.is_superuser ?
              <Icon
                style={{marginHorizontal: 5}}
                onPress={() => setPostMenuToggle(!postMenuToggle)}
                name='options-vertical'
                type='simple-line-icon'
                size={25}
                color='#FFC300'/>
                :
                null
            }
          </View>
        </View>

        <View style={styles.postTextView}>
          <Text
            key={Math.random()}
            selectable
            onTextLayout={textLayoutEvent => onLayout(textLayoutEvent)}
            numberOfLines={maxNumberOfLines}
            ellipsizeMode={'tail'}
            style={styles.postText}>
            {post.content}
          </Text>
          {
            numberOfLines > maxNumberOfLines ? (
              <TouchableOpacity onPress={() => readMore()}>
                <Text style={commentSectionStyles.blueText}>read more</Text>
              </TouchableOpacity>
            ) : (null)
          }
          {
            maxNumberOfLines > defaultMaxNumberOfLine ? (
              <TouchableOpacity onPress={() => showLess()}>
                <Text style={commentSectionStyles.blueText}>show less</Text>
              </TouchableOpacity>
            ) : (null)
          }
        </View>

      </View>
      <View style={styles.postImageView}>
        {
          post.image_url?
            <Image
              width={Dimensions.get('window').width}
              source={{uri: Settings.siteUrl + post.image_url}}
              style={styles.postImage}/>
            :
            null
        }
        {
          post.thumbnail_link ? (
            <TouchableWithoutFeedback onPress={() => {
              navigation.navigate('Player', {
                title: 'Video',
                id: post.video_id,
                thumbnail: post.thumbnail_link
              });
            }}>
              <View>
                <Image
                  onLoadEnd={() => {
                    
                  }}
                  onLayout={layout => setImageWidthHeight(layout)}
                  width={Dimensions.get('window').width}
                  source={{uri: post.thumbnail_link}}
                  style={styles.postImage}
                />
                <View
                  onLayout={layout => setIconWidthHeight(layout)}
                   style={{
                    borderRadius: 15,
                    position: 'absolute',
                    right: (imageViewWidth / 2) - (iconWidth / 2),
                    bottom: (imageViewHeight / 2 ) - (iconHeight / 2),
                    backgroundColor: '#000000AA',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                }}>
                  <Icon
                    size={40}
                    name='play'
                    type='font-awesome-5'
                    color={GlobalColors.dcYellow}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : (null)
        }
      </View>
      <PostFooter
        userData={userData}
        post={post}
        setShowCommentSection={setShowCommentSection}
        userData={userData}
        posts={posts}
        setPosts={setPosts}
        userFeed={userFeed}
      />

      {showCommentSection ? <CommentSection userFeed={userFeed} posts={posts} post={post} setPosts={setPosts} userData={userData} comments={post.comments}/> : null}
    </View>
  )
}

const CommentSection = ({comments, userData, post, posts, setPosts, userFeed}) => {
  const [commentText, setCommentText] = React.useState('')

  return (
    <View style={styles.commentSection}>
      <View style={commentSectionStyles.commentInputView}>
        <CommentInputText
          onPress={() => {
            uploadComment(userData, commentText, post.id, posts, setPosts);
            setCommentText('');
          }}
          userData={userData}
          placeholder={"Write a comment..."}
          value={commentText}
          setValue={setCommentText}/>
      </View>
      <Comments
        posts={posts}
        userFeed={userFeed}
        setPosts={setPosts}
        userData={userData}
        comments={comments}
      />
    </View>
  )
}

const Comments = ({comments, userData, posts, setPosts, userFeed}) => {
  const [commentsToShow, setCommentsToShow] = React.useState([]);
  const [numCommentsToShow, setNumCommentsToShow] = React.useState(
    comments.length > hideCommentsValue
    ? hideCommentsValue : comments.length);

  const numOfComments = comments.length;

  React.useEffect(() => {
    updateComments();
  }, [posts]);

  function updateComments(){
    let newCommentsArray = [];
    let toShow = (comments.length > hideCommentsValue ? hideCommentsValue : comments.length)
    for (var i = 0; i < toShow; i++) {
      newCommentsArray[i] = comments[i];
    }
    setCommentsToShow(newCommentsArray)
  }

  function showMoreComments(){

    let newCount;

    if(numCommentsToShow === numOfComments){
      newCount = hideCommentsValue;
      setNumCommentsToShow(hideCommentsValue);
    }
    else if(numCommentsToShow + hideCommentsValue > numOfComments){
        newCount = numOfComments;
        setNumCommentsToShow(numOfComments);
      }
    else{
      newCount = numCommentsToShow + hideCommentsValue;
      setNumCommentsToShow(numCommentsToShow + hideCommentsValue);
    }

    let newCommentsArray = [];
    for (var i = 0; i < newCount; i++) {
      newCommentsArray[i] = comments[i];
    }
    setCommentsToShow(newCommentsArray);
  }

  return (
    <View>
      <CommentComponent
        userFeed={userFeed}
        posts={posts}
        setPosts={setPosts}
        userData={userData}
        comments={commentsToShow}/>
      {
        numOfComments > hideCommentsValue ? (
          <TouchableOpacity onPress={() => showMoreComments()}>
            <Text
              textDecorationLine={'underline'}
              style={[commentSectionStyles.blueText, {
                  paddingBottom: 10,
                  marginLeft: 10,
                }]}>

            {
              numCommentsToShow !==  numOfComments ?
              `Show More Comments (${numOfComments - numCommentsToShow})`
              :
              'Hide Comments'
            }
            </Text>
          </TouchableOpacity>
        ) : (null)
      }
    </View>
  )

}

const CommentComponent = ({comments, userData, posts, setPosts, userFeed}) =>{
  return comments.map((comment, i) => {

    const name = `${comment.user.fName} ${comment.user.sName}`
    return(
      <View key={comment.id} style={commentSectionStyles.commentView}>
        {/* OG commenter Avatar and line column*/}
        <View>
          <CustomAvatar lightColour={true} name={name} avatarURL={comment.user.avatarURL} style={{alignSelf : 'flex-start'}}/>
          {
            comment.replies.length > 0 ?
              <View style={styles.yellowLineVertical}></View>
              :
              null
          }
        </View>
        {/* OG comment and replies column*/}
        <View style={{flex : 1}}>
          <View>
            <View style={{flexDirection : 'row'}}>
              <View style={{flex : 0}}>
                <Comment comment={comment}/>
              </View>
              <View style={{flex : 1}}>
              </View>
            </View>
            <CommentButtons
              onPress={() =>
                likePostElement(userData, 'comment', comment.id, posts, setPosts, userFeed)
              }
              comment={comment}
              posts={posts}
              setPosts={setPosts}
              userData={userData}
              likes={comment.like_count}
              replyOption={true}
            />
          </View>

          <View>
            {
              comment.replies.length > 0 ?
              <CommentReplies
                userData={userData}
                setPosts={setPosts}
                userFeed={userFeed}
                replies={comment.replies}
                posts={posts}
              />
              :
              null
            }
          </View>
        </View>
      </View>
    )
  })
}

const Comment = ({comment}) => {
  const defaultMaxNumberOfLine = 4;
  const [numberOfLines, setNumberOfLines] = React.useState(null);
  const [maxNumberOfLines, setMaxNumberOfLines] = React.useState(defaultMaxNumberOfLine);

  function onLayout(textLayoutEvent){
    if(numberOfLines) return;
    let numLine = textLayoutEvent.nativeEvent.lines.length;
    setNumberOfLines(numLine);
  }

  function readMore(){
    setMaxNumberOfLines(numberOfLines);
  }

  function showLess(){
    setMaxNumberOfLines(defaultMaxNumberOfLine);
  }

  return (
    <View style={{flexDirection : 'row'}}>
      <View style={commentSectionStyles.commentTextView}>
        <UsersName
          isStaff={comment.user.isStaff}
          isSuperUser={comment.user.isSuperUser}
          fName={comment.user.fName}
          sName={comment.user.sName}
          defaultFont={true}
          fontSize={16}/>
        <Text
          key={Math.random()}
          selectable={true}
          onTextLayout={textLayoutEvent => onLayout(textLayoutEvent)}
          numberOfLines={maxNumberOfLines}
          ellipsizeMode={'tail'}
          style={commentSectionStyles.commentText}>

          {comment.text}
        </Text>
        {
          numberOfLines > maxNumberOfLines ? (
            <TouchableOpacity onPress={() => readMore()}>
              <Text style={commentSectionStyles.blueText}>read more</Text>
            </TouchableOpacity>
          ) : (null)
        }
        {
          maxNumberOfLines > defaultMaxNumberOfLine ? (
            <TouchableOpacity onPress={() => showLess()}>
              <Text style={commentSectionStyles.blueText}>show less</Text>
            </TouchableOpacity>
          ) : (null)
        }
      </View>
    </View>
  );
}

const CommentButtons = ({userData, likes, replyOption, posts, setPosts, comment, onPress}) => {
  const [replying, setReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  return(
    <View>
      <View style={commentSectionStyles.commentButtons}>
        <TouchableOpacity onPress={onPress}>
          <Text style={postFooterStyles.likeCommentText}>Like</Text>
        </TouchableOpacity>
        {
          replyOption === true ?
            <View style={{flexDirection : 'row'}}>
              <Text style={postFooterStyles.likeCommentText}>
                {'  -  '}
              </Text>
              <TouchableOpacity onPress={() => setReplying(true)}>
                <Text style={postFooterStyles.likeCommentText}>Reply</Text>
              </TouchableOpacity>
            </View>
          :
          null
        }

        {
          likes > 0 ?
            <View style={commentSectionStyles.commentBadgeView}>
              <Icon name='thumb-up' size={15} color='#FFC300'/>
              <Text style={commentSectionStyles.commentBadgeText}> {likes > 99 ? '99+' : likes}</Text>
            </View>
            :
            null
        }



      </View>
      {
        replying ? (
          <CommentInputText
            onPress={() => {

              uploadReply(userData, replyText, comment.post_id, comment.id, posts, setPosts)
              setReplyText('');
              setReplying(false);
            }}
            value={replyText}
            setValue={setReplyText}
            userData={userData}
            placeholder={"reply..."}/>
        ) : (null)
      }
    </View>
  );
}

const CommentReplyComponent = ({replies, posts, setPosts, userFeed, userData}) => {

  return replies.map((reply, i) => {
    const name = `${reply.user.fName} ${reply.user.sName}`;

    return(
      <View key={i}>

        {/* marginRight : 0 to cancel out comment margin right to keep replies and comments the same size */}
        <View style={[commentSectionStyles.commentView, {marginRight : 0}]}>
          <CustomAvatar lightColour={true} name={name} avatarURL={reply.user.avatarURL} style={{alignSelf : 'flex-start'}}/>
          <View style={{flex : 1, flexDirection : 'row'}}>
            <View style={{flex : 0}}>
              <Reply reply={reply}/>
            </View>
            <View style={{flex : 1}}>
            </View>
          </View>

        </View>

        <View style={{marginLeft : 48}}>
          <CommentButtons
            onPress={() =>
              likePostElement(userData, 'reply', reply.id, posts, setPosts, userFeed)
            }
            userData={userData}
            likes={reply.like_count}
            replyOption={false}
          />
        </View>
      </View>
    )
  })

}

const Reply = ({reply, userData}) => {
  const defaultMaxNumberOfLine = 4;
  const [numberOfLines, setNumberOfLines] = React.useState(null);
  const [maxNumberOfLines, setMaxNumberOfLines] = React.useState(defaultMaxNumberOfLine);
  const ref = React.useRef();

  function onLayout(textLayoutEvent){
    if(numberOfLines) return;
    let numLine = textLayoutEvent.nativeEvent.lines.length;
    setNumberOfLines(numLine);
  }

  function readMore(){
    setMaxNumberOfLines(numberOfLines);
  }

  function showLess(){
    setMaxNumberOfLines(defaultMaxNumberOfLine);
  }


  return(
    <View style={commentSectionStyles.commentTextView}>
      <UsersName
        isStaff={reply.user.isStaff}
        isSuperUser={reply.user.isSuperUser}
        fName={reply.user.fName}
        sName={reply.user.sName}
        defaultFont={true}
        fontSize={16}/>
      <Text
        key={Math.random()}
        selectable={true}
        onTextLayout={textLayoutEvent => onLayout(textLayoutEvent)}
        numberOfLines={maxNumberOfLines}
        ellipsizeMode={'tail'}
        style={commentSectionStyles.commentText}>
        {reply.text}
      </Text>
      {
        numberOfLines > maxNumberOfLines ? (
          <TouchableOpacity onPress={() => readMore()}>
            <Text style={commentSectionStyles.blueText}>read more</Text>
          </TouchableOpacity>
        ) : (null)
      }
      {
        maxNumberOfLines > defaultMaxNumberOfLine ? (
          <TouchableOpacity onPress={() => showLess()}>
            <Text style={commentSectionStyles.blueText}>show less</Text>
          </TouchableOpacity>
        ) : (null)
      }
    </View>
  );
}

const CommentReplies = ({replies, userData, posts, setPosts, userFeed}) => {
  const [repliesToShow, setRepliesToShow] = React.useState([]);
  // const intialToShow = replies.length > hideRepliesValue ? hideRepliesValue : replies.length;
  const [numRepliesToShow, setNumRepliesToShow] = React.useState(0)


  const numOfReplies = replies.length;

  React.useEffect(() => {
    updateReplies();
  }, [posts]);

  function countNewReplies(){
    let total = 0;
    for (var i = 0; i < replies.length; i++)
      if(replies[i].new) total++;
    return total;
  }

  function updateReplies(){
    let newRepliesArray = [];

    let toShow;
    if(replies.length > 0){
        if(replies[0].new && numRepliesToShow <= 1){
          toShow = countNewReplies();
        }
        else{
          toShow = numRepliesToShow; // (replies.length > hideRepliesValue ? hideRepliesValue : replies.length)
        }
    }
    setNumRepliesToShow(toShow);

    for (var i = 0; i < toShow; i++) {
      newRepliesArray[i] = replies[i];
    }
    setRepliesToShow(newRepliesArray)
  }

  function showMoreReplies(){
    let newCount;

    // RESET
    if(numRepliesToShow === numOfReplies){
      newCount = hideRepliesValue;
      setNumRepliesToShow(hideRepliesValue);
    }
    // INCREASE <= MAX
    else if(numRepliesToShow + 3 > numOfReplies){
        newCount = numOfReplies;
        setNumRepliesToShow(numOfReplies);
      }
    // INCREASE
    else{
      newCount = numRepliesToShow + 3;
      setNumRepliesToShow(newCount);
    }

    let newRepliesArray = [];
    for (var i = 0; i < newCount; i++) {
      newRepliesArray[i] = replies[i];
    }
    setRepliesToShow(newRepliesArray);
  }

  return (
    <View>
      <CommentReplyComponent setPosts={setPosts} userFeed={userFeed} posts={posts} userData={userData} replies={repliesToShow}/>
      {
        replies.length > hideRepliesValue ? (
          <TouchableOpacity onPress={() => showMoreReplies()}>
            <Text
              textDecorationLine={'underline'}
              style={[commentSectionStyles.blueText,
                {
                  paddingBottom: 10,
                  marginLeft: 20,
                }]}>
            {
              numRepliesToShow !==  numOfReplies ?
              `Show More Replies (${numOfReplies - numRepliesToShow})`
              :
              'Hide Replies'
            }
            </Text>
          </TouchableOpacity>
        ) : (null)
      }
    </View>
  )
}

const CommentInputText = ({placeholder, userData, onPress, setValue, value}) => {
  const name = `${userData.first_name} ${userData.last_name}`;
  return (
    <View style={{marginLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
      <CustomAvatar lightColour={true} name={name} avatarURL={userData.avatarURL}/>
      <View style={textStyles.postTextContainer}>
        <TextInput
            value={value}
            onChangeText={setValue}
            multiline={true}
            style={textStyles.inputText}
            placeholder={placeholder}
            maxLength={1000}
            placeholderTextColor={'#afafaf'}
          />
      </View>
      <View style={{paddingRight: 10}}>
        <Icon onPress={onPress} name='send' size={35} color='#FFC300'/>
      </View>
    </View>
  )
}

const PostFooter = ({post, setShowCommentSection, userData, posts, setPosts, userFeed}) => {
  return (
    <View>
      <View style={postFooterStyles.likeCommentBar}>
        <Text style={postFooterStyles.likeCommentText}>
          <Icon
            style={{top: 3, marginRight: 5}}
            name='thumb-up'
            size={20}
            color='#FFC300'/>
          {post.like_count} like{post.like_count === 1 ? '' : 's'}
        </Text>
        <Text style={postFooterStyles.likeCommentText}>{post.comments.length} comment{post.comments.length === 1 ? '' : 's'}</Text>
      </View>

      <Line/>
      <View style={postFooterStyles.postFooter}>
        <LikeButton
          onPress={() => likePostElement(userData, 'post', post.id, posts, setPosts, userFeed)}
        />
        <CommentButton setShowCommentSection={setShowCommentSection}/>
      </View>
      <Line/>
    </View>
  )
}

const Line = () => {
  return (
    <View style={styles.line}></View>
  );
}

const LikeButton = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      underlayColor={'#212121'}
      style={footButtonStyles.postFooterButton}>
      <View style={footButtonStyles.postFooterButtonView}>
        <Icon
          name='thumb-up'
          size={20}
          color='#FFC300'/>
        <View style={footButtonStyles.textView}>
          <Text style={footButtonStyles.text}>Like</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const CommentButton = ({setShowCommentSection}) => {
  return (
    <TouchableOpacity
      underlayColor={'#212121'}
      style={footButtonStyles.postFooterButton}
      onPress={() => setShowCommentSection(true)}>
      <View style={footButtonStyles.postFooterButtonView}>
        <View style={footButtonStyles.textView}>
          <Text style={footButtonStyles.text}>Comment  </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Feed;

const footButtonStyles = StyleSheet.create({
  postFooterButton : {
    margin : 10
  },
  postFooterButtonView : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    borderColor : '#FFC300',
    borderWidth : 1,
    borderRadius : 100,
    width : 120,
    paddingVertical : 5
  },
  textView : {
    marginLeft : 10
  },
  text : {
    fontSize : 16,
    color : '#FFC300',
  }
});

const textStyles = StyleSheet.create({
  inputText : {
    paddingHorizontal : 20,
    paddingVertical : 6,
    color : 'white',
    fontSize : 16,
  },
  postTextContainer : {
    backgroundColor : '#494949',
    borderRadius : 20,
    marginVertical : 15,
    marginLeft : 10,
    marginRight : 5,
    flex : 1
  },
  chatText : {
    color : '#FFFFFF',
    fontSize : 16,
    fontWeight: "bold"
  },
});

const commentSectionStyles = StyleSheet.create({
  commentInputView : {
    alignItems : 'flex-start',
    flexDirection : 'row',
  },
  commentView : {
    marginHorizontal : 10,
    alignItems : 'flex-start',
    flexDirection : 'row',
  },
  commentTextView : {
    backgroundColor : '#494949',
    borderRadius : 20,
    marginLeft : 10,
    paddingHorizontal : 10,
    paddingVertical : 8,
  },
  commentText : {
    color : 'white',
    fontSize : 16,
    padding : 3
  },
  commentButtons : {
    marginLeft : 20,
    padding : 5,
    marginBottom : 10,
    flexDirection : 'row',
    alignItems : 'center'
  },
  commentBadgeView : {
    borderRadius : 30,
    backgroundColor : '#494949',
    flexDirection : 'row',
    paddingHorizontal : 7,
    alignItems : 'center',
    alignSelf : 'flex-end',
    marginHorizontal : 10
  },
  commentBadgeText : {
    color : '#afafaf',
    fontSize : 16
  },
  blueText:{
    color: '#5555dd',
    fontSize : 16,
    padding : 3
  }
});

const postFooterStyles = StyleSheet.create({
  likeCommentBar : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    marginVertical : 9,
    marginHorizontal : 15
  },
  likeCommentText : {
    color : '#afafaf',
    fontWeight : 'bold',
    fontSize : 16
  },
  postFooter : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    marginHorizontal : 20
  },
});

const styles = StyleSheet.create({
  feedView : {
    backgroundColor : '#494949',
    flex: 1
  },
  post : {
    backgroundColor : '#2D2D2D',
    marginBottom : 15,
  },
  postHeader : {
    margin : 5
  },
  postUserHeader : {
    flexDirection : 'row',
    alignItems : 'center',
    margin : 5
  },
  postImage : {
    width : Dimensions.get('window').width,
  },
  line : {
    borderBottomColor : '#494949',
    borderBottomWidth: 1,
    marginHorizontal : 10,
  },
  yellowLineVertical : {
    borderColor : '#494949',
    borderLeftWidth: 4,
    marginLeft : 18,
    marginVertical : 30,
    flex : 1
  },
  orginalPosterText : {
    color : '#FFFFFF',
    fontSize : 14,
    fontWeight : 'bold'
  },
  orginalPosterTextStaff : {
    color : '#FFC300',
    fontSize : 14,
    fontWeight : 'bold'
  },
  postTextView : {
    margin : 3
  },
  postText : {
    color : '#FFFFFF',
    fontSize : 16,
    margin : 5
  }
});
