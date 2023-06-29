import React, {useEffect, useRef, useState} from 'react'
import "./Messages.css"
import Msgheader from './Header/msgheader'
import Msginput from './Input/input'
import Msgcontent from './Content/content'
import {database,ref,off,child,onChildAdded, onChildRemoved,set,remove} from "../../server/firebase";
import { connect } from "react-redux";
import { Segment, Comment } from 'semantic-ui-react';
import { setfavouriteChannel, removefavouriteChannel } from "../../store/actioncreator";

const msgRef = ref(database, 'messages');
const usersRef = ref(database, 'users');
const Messages = (props) => {
  const [messagesState, setMessagesState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");

  let divRef = useRef();
  useEffect(() => {
    if (props.channel) {
      setMessagesState([]);

      const channelRef = child(msgRef,props.channel.id);
      onChildAdded((channelRef),(snap) => {
        setMessagesState((currentState) => {
            let updatedState = [...currentState];
            updatedState.push(snap.val());
            return updatedState;
        });
      })
      return () => {
        off(channelRef);
      };
    }
  }, [props.channel]);

  useEffect(() => {
    if (props.user) {
      const userRef = child(usersRef, props.user.uid);
      const favouriteRef = child(userRef, "favourite");
      onChildAdded((favouriteRef),(snap) => {
        props.setfavouriteChannel(snap.val());
      });
      onChildRemoved((favouriteRef),(snap) => {
        props.removefavouriteChannel(snap.val());
        // console.log("ok")
      });
      return () => {
        off(favouriteRef);
      };
    }
  }, [props.user]);
  useEffect(()=> {
    divRef.scrollIntoView({behavior : 'smooth'});
},[messagesState])

const displayMessages = () => {
  let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messagesState;
  if (messagesToDisplay.length > 0) {
    return messagesToDisplay.map((message) => {
      return <Msgcontent imageLoaded={imageLoaded} ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />;
    });
  }
};
const imageLoaded= () => {
  divRef.scrollIntoView({behavior : 'smooth'});
}
    const uniqueUsersCnt =()=>{
      const uniqueUsers = messagesState.reduce((acc, message) => {
        if (!acc.includes(message.user.name)) {
            acc.push(message.user.name);
        }
        return acc;
    }, []);

    return uniqueUsers.length;
    }
    const searchTermChange = (e) => {
      const target = e.target;
      setSearchTermState(target.value);
  }
  const filterMessageBySearchTerm = () => {
    const regex = new RegExp(searchTermState, "gi"); //global/ignore case
    const messages = messagesState.reduce((acc, message) => {
        if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
            acc.push(message);
        }
        return acc;
    }, []);

    return messages;
}

const starChange = () => {
  const usersRef = ref(database, 'users');
  const userRef = child(usersRef, props.user.uid);
  const favouriteRef = child(userRef, "favourite");
  const favRef=child(favouriteRef,props.channel.id);
  if(isStarred()) {
    remove(favRef);
  } else {
    set(favRef,{
      "channelId": props.channel.id,
      "channelName": props.channel.name
    });
  }
};

const isStarred = () => {

  return (Object.keys(props.favouriteChannels).includes(props.channel?.id))
};

    return <div className='messages'> 
      <Msgheader starChange={starChange} starred={isStarred()} isPrivateChat={props.channel?.isPrivateChat}channelName={props.channel?.name} searchTermChange={searchTermChange} uniqueUsers={uniqueUsersCnt()} />
    <Segment className='messagecontent'>
      <Comment.Group>
        {displayMessages()}
        <div ref={currentEl => divRef = currentEl}></div>
      </Comment.Group>
    </Segment>
    <Msginput/> </div>
  }
const mapStateToProps = (state) => {
  return {
      channel: state.channel.currentChannel,
      user: state.user.currentUser,
      favouriteChannels: state.favouriteChannel.favouriteChannel
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
      setfavouriteChannel: (channel) => dispatch(setfavouriteChannel(channel)),
      removefavouriteChannel: (channel) => dispatch(removefavouriteChannel(channel)),
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
