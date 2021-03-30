import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import {Icon} from 'react-native-elements';
import {globalStyles} from '../styles/dcstyles';
import CustomAvatar from '../shared/customAvatar';

var loremIpsum = require('lorem-ipsum-react-native');
const resolveAssetSource = Image.resolveAssetSource;

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

  for(let i = 0; i < RandomNumber(5) + 1; i++){
    //var comment = new CommentObject(RandomName(), 'i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i a i i i i i i i i i a i i i i i i i i i i i i i i i i i a i i i i i i i i i i a i i i i i i i a i i i i i i i i i i i a i i i i i i i  '); //GenerateCommentText()
    //var comment = new CommentObject(RandomName(), 'hello');//GenerateCommentText());
    var comment = new CommentObject(RandomName(), GenerateCommentText());
    if(RandomNumber(10) < 3){
      for(let j = 0; j < RandomNumber(4) + 1; j++){
        //comment.replies.push(new CommentObject(RandomName(),'i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i i  ' )); //GenerateCommentText()
        comment.replies.push(new CommentObject(RandomName(), GenerateCommentText()));
      }
    }
    comments.push(comment);
  }
  return comments;
}

function Scale(image){
  const sourceToUse = resolveAssetSource(image);

  if(sourceToUse === null) {
    return 1;
  }
  var scale = Dimensions.get('window').width / sourceToUse.width;
  return sourceToUse.height * scale;
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
  for(let i = 0; i < 15; i++){
    posts.push(
      new Post(
        RandomName(),
        loremIpsum({count : RandomNumber(4) + 1, units : 'sentences', format : 'plain'}),
        RandomNumber(10) > 6 ? imageList[RandomNumber(imageList.length)] : null,
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
      <View key={i} style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.postUserHeader}>
            <CustomAvatar initials={post.initials}/>
            <Text style={[
              (post.staff ? styles.orginalPosterTextStaff : styles.orginalPosterText),
               {fontSize : 18}]}>   {post.name}
            </Text>
          </View>

          <View style={styles.postTextView}>
            <Text style={styles.postText}>
              {post.text}
            </Text>
          </View>

        </View>
        <View style={styles.postImageView}>
          {
            post.image !== null ?
              <Image source={post.image} style={[styles.postImage, {height : Scale(post.image)}]}/>
              :
              null
          }
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
        <View style={{marginTop : 14}}>
          <CustomAvatar/>
        </View>
        <CommentInputText placeholder={"Write a comment..."}/>
      </View>

      <Comments comments={comments}/>

    </View>
  )
}

const Comments = ({comments}) => {
  return comments.map((comment, i) => {
    return(
      <View key={i} style={commentSectionStyles.commentView}>
        {/* OG commenter Avatar and line column*/}
        <View>
          <CustomAvatar initials={comment.initials} style={{alignSelf : 'flex-start'}}/>
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
            <CommentButtons likes={comment.likes} replyOption={true}/>
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
  return (
    <View style={{flexDirection : 'row'}}>
      <View style={commentSectionStyles.commentTextView}>
        <Text numberOfLines={4} style={commentSectionStyles.commentText}>
          <Text style={(comment.staff ? styles.orginalPosterTextStaff : styles.orginalPosterText)}>{comment.name}{'\n'}</Text>
          {comment.text}
        </Text>
      </View>


    </View>
  );
}

const CommentButtons = ({likes, replyOption}) => {
  return(
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
            <TouchableOpacity>
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
  );
}

const CommentReplies = ({replies}) => {
  return replies.map((reply, i) => {
    return(
      <View key={i}>

        {/* marginRight : 0 to cancel out comment margin right to keep replies and comments the same size */}
        <View style={[commentSectionStyles.commentView, {marginRight : 0}]}>

          <CustomAvatar initials={reply.initials} style={{alignSelf : 'flex-start'}}/>
          <View style={{flex : 1, flexDirection : 'row'}}>
            <View style={{flex : 0}}>
              <View style={commentSectionStyles.commentTextView}>
                <Text numberOfLines={4} style={commentSectionStyles.commentText}>
                  <Text style={(reply.staff ? styles.orginalPosterTextStaff : styles.orginalPosterText)}>{reply.name}{'\n'}</Text>
                  {reply.text}
                </Text>
              </View>


            </View>
            <View style={{flex : 1}}>
            </View>
          </View>

        </View>

        <View style={{marginLeft : 48}}>
          <CommentButtons likes={reply.likes} replyOption={false}/>
        </View>
      </View>
    )
  })
}



const CommentInputText = ({placeholder}) => {
  return (
    <View style={textStyles.postTextContainer}>
      <TextInput
          multiline={true}
          style={textStyles.inputText}
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

      <Line/>
      <View style={postFooterStyles.postFooter}>
        <LikeButton/>
        <CommentButton/>
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

const CommentButton = () => {
  return (
    <TouchableHighlight underlayColor={'#212121'} style={footButtonStyles.postFooterButton}>
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
    marginHorizontal : 10,
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
    //marginRight : 80,
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
