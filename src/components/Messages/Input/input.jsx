import React,{useState} from 'react'
import { Segment, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import {database,push,ref,serverTimestamp,set} from "../../../server/firebase";
import { storage } from "../../../server/firebase";
import { ref as stref, getDownloadURL, uploadBytes} from "firebase/storage";
import ImageUpload from '../ImageUpload/ImageUpload';
import { v4 as uuidv4 } from "uuid";


const Msginput = (props) => {

  const [messageState, setMessageState] = useState("");
  const [fileDialogState, setfileDialogState] = useState(false);
  const createMessageInfo = (downloadUrl) => {
    return {
        user: {
            avatar: props.user.photoURL,
            name: props.user.displayName,
            id: props.user.uid
        },
        content: messageState,
        image : downloadUrl || "",
        timestamp: serverTimestamp()
    }
}
const handleKeypress = e => {
if (e.charCode === 13) {
  onSubmit()
}
};
  const onSubmit =(downloadUrl)=>
  {
    if(messageState || downloadUrl)
    {
      set(push(ref(database,'messages/'+props.channel.id)),createMessageInfo(downloadUrl))
      .then(() => {
        setMessageState("")
    })
    .catch((err) => {
        console.log(err);
    })
    }
  }

  const onMessageChange = (e) => {
    const target = e.target;
    setMessageState(target.value);
}
    const createButtons = () =>
    {
        return <>
            <Button icon='send' type='submit' onClick={() => {onSubmit()  }}  />
            <Button icon='attach' onClick={() => setfileDialogState(true)}/>
        </>
    }
    const uploadImage = (file, contentType) => {
      const filePath = `chat/images/${uuidv4()}.jpg`;
      const storageRef = stref(storage,filePath);
      uploadBytes(storageRef, file, { contentType: contentType })
  .then((data) => {
    getDownloadURL(data.ref)
    .then((url) => {
      onSubmit(url);
      console.log(url);
  })
  .catch((err) => console.log(err));
  })
  .catch((error) => {
    console.log(error);
  });
    }
  return (
  <Segment>
        <Input
        onChange={onMessageChange}
        onKeyPress={handleKeypress}
        name='message'
        value={messageState}
        label={createButtons()}
        labelPosition='right'
        fluid={true}
        />
        <ImageUpload uploadImage={uploadImage} open={fileDialogState} onClose={() => setfileDialogState(false)}/>
    </Segment>
  )
}
const mapStateToProps = (state) => {
  return {
      user: state.user.currentUser,
      channel: state.channel.currentChannel
  }
}

export default connect(mapStateToProps)(Msginput);
