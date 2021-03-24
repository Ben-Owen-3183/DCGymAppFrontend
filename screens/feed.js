import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
import {globalStyles} from '../styles/dcstyles';

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

function Post(name, text, image, comments){
  this.name = name;
  this.initials = GetInitials(name);
  this.text = text;
  this.image = image;
  this.comments = comments;
  this.likes = RandomNumber(12);
}

function GetInitials(name){
  return name.split(" ")[0].split("")[0] + name.split(" ")[1].split("")[0];
}

function Comment(name, text){
  this.name = name;
  this.initials = GetInitials(name);
  this.text = text;
  this.likes = RandomNumber(2) == 1 ? RandomNumber(12) : 0;
  this.replies = Array();
}

function RandomNumber(max){
  return (Math.floor(Math.random() * max))
}

function RandomName(){
  return(names[RandomNumber(names.length)]);
}

function GenerateComments(){
  var comments = Array();

  for(let i = 0; i < RandomNumber(4); i++){
    var comment = new Comment(RandomName(), GenerateCommentText());

    if(RandomNumber(10) < 2){
      for(let j = 0; j < RandomNumber(2) + 1; j++){
        comment.replies.push(new Comment(RandomName(), GenerateCommentText));
      }
    }

    comments.push(comment);
  }
  return comments;
}

function GenerateCommentText(){
  return loremIpsum({
    count : RandomNumber(3) + 1,
    units : 'sentences',
    format : 'plain',
    sentenceLowerBound: 2,
    sentenceUpperBound: 8
  })
}


function GeneratePosts(){
  var posts = Array();

  for(let i = 0; i < 10; i++){
    posts.push(
      new Post(
        RandomName(),
        loremIpsum({count : RandomNumber(4) + 1, units : 'sentences', format : 'plain'}),
        RandomNumber(10) > 4 ? imageList[0] : null,
        GenerateComments()
    ));
  }
  return posts;
}

const Feed = () => {
  return (
    <View style={styles.feedView}>
      <ScrollView>

        <View style={styles.newPostView}>
          <Text> New Post Here </Text>

        </View>

        <View style={styles.postSection}>
          <Posts/>
        </View>

        </ScrollView>
      </View>
  );
}

const Posts = () => {
  return GeneratePosts().map((post, i) =>{
    return(
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.postUserHeader}>
            <CustomAvatar initials={post.initials}/>
            <Text style={styles.orginalPosterText}>   {post.name}</Text>
          </View>

          <View style={styles.postTextView}>
            <Text style={styles.postText}>
              {post.text}
            </Text>
          </View>

        </View>
        <View style={styles.postImageView}>
          <Image source={imageList[0]} style={styles.postImage}/>
        </View>

        <PostFooter post={post}/>

        {post.comments.length > 0 ? <CommentSection comments={post.comments}/> : null}


      </View>
  )})
}

const CommentSection = ({comments}) => {
  return (
    <View style={styles.commentSection}>
      <View style={commentSectionStyles.commentInputView}>
        <CustomAvatar/>
        <CommentInputText placeholder={"Write a comment..."}/>
      </View>
      {/* comments  */}
      <Comments comments={comments}/>

    </View>
  )
}


const Comments = ({comments}) => {
  return comments.map((comment, i) => {
    return(
      <View key={i}>
        <View style={commentSectionStyles.commentView}>
          <CustomAvatar initials={comment.initials} style={{alignSelf : 'flex-start'}}/>
          <View>
            <View style={commentSectionStyles.commentTextView}>
              <Text numberOfLines={4} style={commentSectionStyles.commentText}>
                <Text style={[commentSectionStyles.commentText, { fontSize : 14, fontWeight: "bold"}]}>{comment.name}{'\n'}</Text>
                {comment.text}
              </Text>
            </View>
            {
              comment.likes > 0 ?
                <View style={comment.text.length < 20 ? commentSectionStyles.commentBadgeViewShort : commentSectionStyles.commentBadgeView}>
                  <Icon name='thumb-up' size={15} color='#FFC300'/>
                  <Text style={commentSectionStyles.commentBadgeText}> {comment.likes > 99 ? '99+' : comment.likes}</Text>
                </View>
                :
                null
            }
          </View>
        </View>

        <View style={commentSectionStyles.commentButtons}>
          <TouchableOpacity>
            <Text style={postFooterStyles.likeCommentText}>Like</Text>
          </TouchableOpacity>
          <Text style={postFooterStyles.likeCommentText}>
            {'  -  '}
          </Text>
          <TouchableOpacity>
            <Text style={postFooterStyles.likeCommentText}>Reply</Text>
          </TouchableOpacity>
          {/*only render like badge if likes are greater than 0*/}

        </View>
        {comment.replies > 0 ? <CommentReplies replies={replies}/> : null}
      </View>
    )
  })
}

const CommentReplies = ({replies}) => {

}

const CustomAvatar = ({initials, style}) => {
  return (
    <Avatar
      rounded
      size="medium"
      size={38}
      icon={{name: 'user', type: 'font-awesome'}}
      title={initials}
      containerStyle={[styles.avatar, style]}/>
  )
}

const CommentInputText = ({placeholder}) => {
  return (
    <View style={textStyles.postTextContainer}>
      <TextInput
          style={textStyles.inputText}
          value={12}
          placeholder={placeholder}
          placeholderTextColor={'#afafaf'}
        />
    </View>
  )
}

const PostFooter = ({post}) => {
  return (
    <View>
      <View style={postFooterStyles.likeCommentBar}>
        <Text style={postFooterStyles.likeCommentText}>{post.likes} likes</Text>
        <Text style={postFooterStyles.likeCommentText}>{post.comments.length} comments</Text>
      </View>

      <View style={styles.line}></View>
      <View style={postFooterStyles.postFooter}>
        <LikeButton/>
        <CommentButton/>
      </View>
      <View style={styles.line}></View>
    </View>
  )
}

const LikeButton = () => {
  return (
    <TouchableHighlight style={footButtonStyles.postFooterButton}>
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

const CommentButton = () => {
  return (
    <TouchableHighlight style={footButtonStyles.postFooterButton}>
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
    borderRadius : 200,
    margin : 10,
    width : '86%'
  }
});

const commentSectionStyles = StyleSheet.create({
  commentInputView : {
    marginHorizontal : 10,
    alignItems : 'center',
    flexDirection : 'row',
  },
  commentView : {
    marginHorizontal : 10,
    alignItems : 'center',
    flexDirection : 'row',
  },
  commentTextView : {
    backgroundColor : '#494949',
    borderRadius : 30,
    marginHorizontal : 10,
    marginRight : 40,
    paddingHorizontal : 20,
    paddingVertical : 8,
  },
  commentText : {
    color : 'white',
    fontSize : 16,
  },
  commentButtons : {
    marginLeft : 75,
    padding : 5,
    flexDirection : 'row'
  },
  commentBadgeView : {
    //position : 'absolute',
    borderRadius : 30,
    backgroundColor : '#494949',
    flexDirection : 'row',
    paddingHorizontal : 7,
    alignItems : 'center',
    alignSelf : 'flex-end',
    marginRight : 40,
    marginBottom : -25,
    bottom : 10
    //marginLeft : '54%',
    //marginTop : '10%',
    //bottom : 16
  },
  commentBadgeViewShort : {
    //position : 'absolute',
    borderRadius : 30,
    backgroundColor : '#494949',
    flexDirection : 'row',
    paddingHorizontal : 7,
    alignItems : 'center',
    alignSelf : 'flex-end',
    marginRight : 20,
    marginBottom : -25,
    bottom : 18
    //marginLeft : '54%',
    //marginTop : '10%',
    //bottom : 16
  },
  commentBadgeText : {
    color : '#afafaf',
    fontSize : 16
  },

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
    width : '100%'
  },
  post : {
    flex : 1,
    backgroundColor : '#2D2D2D',
    marginTop : 10,
    marginBottom : 10,
    width : '100%'
  },
  avatar : {
    backgroundColor : '#a5a5a5',
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
    flex : 1,
    width : '100%'
  },
  postImage : {
    flex : 1,
    width : 423,
    height : 120,
    resizeMode : 'cover'
  },

  line : {
    borderBottomColor : '#494949',
    borderBottomWidth: 1,
    marginHorizontal : 10,
  },
  commentSection : {

  },
  orginalPosterText : {
    color : '#FFFFFF',
    fontSize : 16
  },
  orginalPosterTextStaff : {
    color : '#FFC300',
    fontSize : 16
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
