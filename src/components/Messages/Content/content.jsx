import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import "./content.css";
TimeAgo.locale(en);

const timeAgo = new TimeAgo();
const Msgcontent = (props) => {
  return (
    <div className={props.ownMessage ? "ownMessage" : null} style={{padding: "5px"}}>
      <Comment>
        <Comment.Avatar src={props.message.user.avatar} />
        <Comment.Content>
            <Comment.Author as="a">{props.message.user.name}</Comment.Author>
            <Comment.Metadata>{timeAgo.format(props.message.timestamp)}</Comment.Metadata>
            {props.message.image ? <Image onLoad={props.imageLoaded} src={props.message.image} />:
              <Comment.Text>{props.message.content}</Comment.Text>
            }
        </Comment.Content>
    </Comment>
    </div>
    
  )
}

export default Msgcontent
