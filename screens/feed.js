import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
  Keyboard
} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {GlobalColors, globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';
import {PrimaryButton, UsersName} from '../shared/basicComponents';
import Settings from '../shared/settings';
import {BoxShadow} from 'react-native-shadow'
import Storage from '../shared/storage';
import { useFocusEffect } from '@react-navigation/native';

const resolveAssetSource = Image.resolveAssetSource;
const windowWidth = Dimensions.get('window').width;
const hideCommentsValue = 3;
const hideRepliesValue = 0;

// post generater
/*
var loremIpsum = require('lorem-ipsum-react-native');

const imageList = [
  require('../assets/images/1.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/3.jpg'),
  require('../assets/images/4.jpg')
];

const names = [
  'Jane Doe',
  'Joe Blogs',
  'Sarah Smith',
  'Greg Smith',
  'Will Jones',
  'Sarah Jones'
];

function PostObject(name, text, image, comments){
  this.name = name;
  this.staff = RandomNumber(10) < 2;
  this.initials = GetInitials(name);
  this.text = text;
  this.image = image;
  this.comments = comments;
  this.likes = RandomNumber(12);
}

function GetInitials(name){
  return name.split(" ")[0].split("")[0] + name.split(" ")[1].split("")[0];
}

function CommentObject(name, text){
  this.name = name;
  this.staff = RandomNumber(10) < 2;
  this.initials = GetInitials(name);
  this.text = text;
  this.likes = RandomNumber(2) == 1 ? RandomNumber(12) : 0;
  this.replies = Array();
}

function RandomNumber(max){
  return (Math.floor(Math.random() * max));
}

function RandomName(){
  return(names[RandomNumber(names.length)]);
}

function GenerateComments(){
  var comments = Array();

  for(let i = 0; i < RandomNumber(7) + 1; i++){
    //var comment = new CommentObject(RandomName(), 'i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i a i i i i i i i i i a i i i i i i i i i i i i i i i i i a i i i i i i i i i i a i i i i i i i a i i i i i i i i i i i a i i i i i i i  '); //GenerateCommentText()
    //var comment = new CommentObject(RandomName(), 'hello');//GenerateCommentText());
    var comment = new CommentObject(RandomName(), GenerateCommentText());
    if(true){
      for(let j = 0; j < RandomNumber(7) + 1; j++){
        //comment.replies.push(new CommentObject(RandomName(),'i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i  ' )); //GenerateCommentText()
        comment.replies.push(new CommentObject(RandomName(), GenerateCommentText()));
      }
    }
    comments.push(comment);
  }
  return comments;
}



function GenerateCommentText(){
  return loremIpsum({
    count : RandomNumber(7) + 1,
    units : 'sentences',
    format : 'plain',
    sentenceLowerBound: 8,
    sentenceUpperBound: 15
  })
}

function GeneratePosts(){
  var posts = Array();
  for(let i = 0; i < 1; i++){
    posts.push(
      new PostObject(
        RandomName(),
        loremIpsum({count : RandomNumber(11) + 1, units : 'sentences', format : 'plain'}),
        RandomNumber(3) > 1 == -1 ? imageList[RandomNumber(imageList.length)] : null,
        GenerateComments()
    ));
  }
  return posts;
}

*/

function Scale(image){
  const sourceToUse = resolveAssetSource(image);

  if(sourceToUse === null) {
    return 1;
  }
  var scale = Dimensions.get('window').width / sourceToUse.width;
  return sourceToUse.height * scale;
}

async function fetchPosts(userData){

  try {
    let response = await fetch(Settings.siteUrl + '/feed/get_posts/', {
        method: "GET",
        headers: {
          "Authorization": "Token " + userData.token,
          "Content-type": "application/json; charset=UTF-8"
        }
      })

    let data = await response.json()
    console.log(`data returned ${JSON.stringify(data)}`);
    return data;
  } catch (e) {
    console.log("Fetch Posts: " + e);
  }
}

async function fetchPostsAfter(){
  body: JSON.stringify({

  })
}

async function fetchPostsBefore(){

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

    let data = await response.json()
    if(data.comment){
      addCommentToPosts(posts, setPosts, data.comment, post_id)
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

    let data = await response.json()
    if(data.reply){
      //addCommentToPosts(posts, setPosts, data.comment, post_id)
    }

  } catch (e) {
    console.log("Upload reply: " + e);
  }
}

function addCommentToPosts(posts, setPosts, comment, postId){
  let newPostsArray = [];
  Object.assign(newPostsArray, posts);

  for (var i = 0; i < newPostsArray.length; i++) {
    if(newPostsArray[i].id.toString() === postId.toString()){
      let newComments = []
      newComments.push(comment);
      newComments = newComments.concat(newPostsArray[i].comments);
      let test = []
      Object.assign(test, newComments);
      newPostsArray[i].comments = test;
      setPosts([].concat(newPostsArray));
      return;
    }
  }
}

const Feed = ({userData, navigation}) => {
  const [viewHeight, setViewHeight] = React.useState(0);
  const [posts, setPosts] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function loadPosts(){
        try {
          let posts_data;

          if(posts.length == 0){
            posts_data = await Storage.get('posts');
            if(posts_data) setPosts(posts_data);
          }

          posts_data = await fetchPosts(userData);

          if(posts_data){
            Storage.set('posts', posts_data);
            setPosts(posts_data);
          }
        } catch (e) {
          console.log('Feed useFocusEffect: ' + e);
        }
      }

      loadPosts();
    }, [])
  );

  return (
    <View onLayout={event => {
          setViewHeight(event.nativeEvent.layout.height);
        }}
        style={styles.feedView}>
      <View style={styles.postSection}>
        <Posts posts={posts} setPosts={setPosts} userData={userData}/>
      </View>

      <FeedMenu navigation={navigation} mainViewHeight={viewHeight}/>
    </View>
  );
}

const FeedMenu = ({mainViewHeight, navigation, posts, setPosts }) => {
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
                  backgroundColor: '#00000090',
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
                  backgroundColor: '#00000090',
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

const Posts = ({userData, posts, setPosts}) => {

  const renderItem = ({ item }) => {
    return (
      <Post posts={posts} setPosts={setPosts} userData={userData} post={item}/>
    );
  };

  return(
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  )
}

const Post = ({userData, post, posts, setPosts}) => {
  const defaultMaxNumberOfLine = 6;
  const [numberOfLines, setNumberOfLines] = React.useState(null);
  const [maxNumberOfLines, setMaxNumberOfLines] = React.useState(defaultMaxNumberOfLine);
  const [showCommentSection, setShowCommentSection] = React.useState(post.comments.length > 0);

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

  const name = `${post.user.fName} ${post.user.sName}`;

  return(
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.postUserHeader}>
          <CustomAvatar name={name} avatarURL={post.user.avatarURL}/>
          <View style={{marginHorizontal: 5}}></View>
          <UsersName
            isStaff={post.user.isStaff}
            isSuperUser={post.user.isSuperUser}
            fName={post.user.fName}
            sName={post.user.sName}
            fontSize={22}/>
        </View>

        <View style={styles.postTextView}>
          <Text
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
          post.image !== null ?
            <Image source={{uri: post.image_url}} style={[styles.postImage, {height : Scale(post.image)}]}/>
            :
            null
        }
      </View>

      <PostFooter userData={userData} post={post} setShowCommentSection={setShowCommentSection}/>

      {showCommentSection ? <CommentSection posts={posts} post={post} setPosts={setPosts} userData={userData} comments={post.comments}/> : null}
    </View>
  )
}

const CommentSection = ({comments, userData, post, posts, setPosts}) => {
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

      <Comments posts={posts} setPosts={setPosts} userData={userData} comments={comments}/>

    </View>
  )
}

const Comments = ({comments, userData, posts, setPosts}) => {
  const [commentsToShow, setCommentsToShow] = React.useState([]);
  const [numCommentsToShow, setNumCommentsToShow] = React.useState(
    comments.length > hideCommentsValue
    ? hideCommentsValue : comments.length);

  const numOfComments = comments.length;
  let newCommentsArray = [];
  React.useEffect(() => {
    updateComments();
  }, [comments.length]);

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
      <CommentComponent posts={posts} setPosts={setPosts} userData={userData} comments={commentsToShow}/>
      {
        numOfComments > hideCommentsValue ? (
          <TouchableOpacity onPress={() => showMoreComments()}>
            <Text
              textDecorationLine={'underline'}
              style={{
                fontSize: 16,
                paddingBottom: 10,
                marginLeft: 20,
                color: '#6c6cd9',
              }}>
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

const CommentComponent = ({comments, userData, posts, setPosts}) =>{
  return comments.map((comment, i) => {
    const name = `${comment.user.fName} ${comment.user.sName}`
    return(
      <View key={comment.id} style={commentSectionStyles.commentView}>
        {/* OG commenter Avatar and line column*/}
        <View>
          <CustomAvatar name={name} avatarURL={comment.user.avatarURL} style={{alignSelf : 'flex-start'}}/>
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
            <CommentButtons comment={comment} posts={posts} setPosts={setPosts} userData={userData} likes={comment.like_count} replyOption={true}/>
          </View>

          <View>
            {comment.replies.length > 0 ? <CommentReplies replies={comment.replies}/> : null}
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

const CommentButtons = ({userData, likes, replyOption, posts, setPosts, comment}) => {
  const [replying, setReplying] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');

  return(
    <View>
      <View style={commentSectionStyles.commentButtons}>
        <TouchableOpacity>
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

const CommentReplyComponent = ({replies, userData}) => {
  return replies.map((reply, i) => {
    return(
      <View key={i}>

        {/* marginRight : 0 to cancel out comment margin right to keep replies and comments the same size */}
        <View style={[commentSectionStyles.commentView, {marginRight : 0}]}>

          <CustomAvatar name={reply.name} style={{alignSelf : 'flex-start'}}/>
          <View style={{flex : 1, flexDirection : 'row'}}>
            <View style={{flex : 0}}>
              <Reply reply={reply}/>
            </View>
            <View style={{flex : 1}}>
            </View>
          </View>

        </View>

        <View style={{marginLeft : 48}}>
          <CommentButtons userData={userData} likes={reply.likes} replyOption={false}/>
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
      <Text
        onTextLayout={textLayoutEvent => onLayout(textLayoutEvent)}
        numberOfLines={maxNumberOfLines}
        ellipsizeMode={'tail'}
        style={commentSectionStyles.commentText}>
        <Text style={(reply.staff ? styles.orginalPosterTextStaff : styles.orginalPosterText)}>{reply.name}{'\n'}</Text>
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

const CommentReplies = ({replies, userData}) => {
  const [repliesToShow, setRepliesToShow] = React.useState([]);
  const [numRepliesToShow, setNumRepliesToShow] = React.useState(
    replies.length > hideRepliesValue
    ? hideRepliesValue : replies.length);

  const numOfReplies = replies.length;

  console.log(`replies: ${JSON.stringify(replies)}`);

  React.useEffect(() => {
    updateReplies();
  }, [replies.length]);

  function updateReplies(){
    let newRepliesArray = [];
    const num = (replies.length > hideRepliesValue ? hideRepliesValue : replies.length)
    for (var i = 0; i < num; i++) {
      newRepliesArray[i] = replies[i];
    }
    console.log(`replies to show: ${JSON.stringify(newRepliesArray)}`);
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
        <CommentReplyComponent userData={userData} replies={repliesToShow}/>
        {
          replies.length > hideRepliesValue ? (
            <TouchableOpacity onPress={() => showMoreReplies()}>
              <Text
                textDecorationLine={'underline'}
                style={{
                  fontSize: 16,
                  paddingBottom: 10,
                  marginLeft: 20,
                  color: '#6c6cd9',
                }}>
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
      <CustomAvatar name={name} avatarURL={userData.avatarURL}/>
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

const PostFooter = ({post, setShowCommentSection}) => {
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
        <LikeButton/>
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

const LikeButton = () => {
  return (
    <TouchableHighlight underlayColor={'#212121'} style={footButtonStyles.postFooterButton}>
      <View style={footButtonStyles.postFooterButtonView}>
        <Icon
          name='thumb-up'
          size={20}
          color='#FFC300'/>
        <View style={footButtonStyles.textView}>
          <Text style={footButtonStyles.text}>Like</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const CommentButton = ({setShowCommentSection}) => {
  return (
    <TouchableHighlight
      underlayColor={'#212121'}
      style={footButtonStyles.postFooterButton}
      onPress={() => setShowCommentSection(true)}>
      <View style={footButtonStyles.postFooterButtonView}>
        <View style={footButtonStyles.textView}>
          <Text style={footButtonStyles.text}>Comment  </Text>
        </View>
      </View>
    </TouchableHighlight>
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
  }
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
    color: '#6c6cd9',
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
      height : '100%',
  },
  newPostView : {
    marginTop : 10,
    marginBottom : 10,
    backgroundColor : 'powderblue'
  },
  postSection : {
  },
  post : {
    backgroundColor : '#2D2D2D',
    marginTop : 10,
    marginBottom : 10,
  },

  postHeader : {
    margin : 5
  },
  postUserHeader : {
    flexDirection : 'row',
    alignItems : 'center',
    margin : 5
  },
  postImageView : {
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
  commentSection : {
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
