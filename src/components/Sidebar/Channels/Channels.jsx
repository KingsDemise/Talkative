import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './Channels.css';
import {database,push,ref,update,onChildAdded,off} from "../../../server/firebase";
import {onDisconnect,child,set,serverTimestamp} from "../../../server/firebase";
import { Menu, Icon, Modal, Button, Form,} from 'semantic-ui-react';
import { setChannel } from "../../../store/actioncreator"
import { Notification } from '../Notification/Notification';

const channelsRef = (ref(database,'channels/'));
const usersRef = (ref(database,'users'));
const Channels = (props) => {
    const [modalOpenState, setModalOpenState] = useState(false);
    const [channelAddState, setChannelAddState] = useState({ name: '', description: '' });
    const [isLoadingState, setLoadingState] = useState(false);
    const [channelsState, setChannelsState] = useState([]);

    useEffect(() => {
        onChildAdded((channelsRef),(snap) => {
            setChannelsState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.val());             
                return updatedState;
            })
        });
        return () => off(channelsRef);
        
    }, [])
    
    useEffect(()=> {
        if (channelsState.length > 0) {
            props.selectChannel(channelsState[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[!props.channel ? channelsState : null ])

    const openModal = () => {
        setModalOpenState(true);
    }

    const closeModal = () => {
        setModalOpenState(false);
    }


    const handleInput = (e) => {

        let target = e.target;
        setChannelAddState((currentState) => {
            let updatedState = { ...currentState };
            updatedState[target.name] = target.value;
            return updatedState;
        })
    }

    const checkIfFormValid = () => {
        return channelAddState && channelAddState.name && channelAddState.description;
    }

    const displayChannels = () => {
        if (channelsState.length > 0) {
            return channelsState.map((channel) => {
                return <Menu.Item
                    key={channel.id}
                    name={channel.name}
                    onClick={() => selectChannel(channel)}
                    active={props.channel && channel.id === props.channel.id && !props.channel.isFavourite}
                >
                    <Notification user={props.user} channel={props.channel}
                        notificationChannelId={channel.id}
                        displayName= {channel.name} />
                </Menu.Item>
            })
        }
    }
    const selectChannel = (channel) => {
        setLastVisited(props.user,props.channel);
        setLastVisited(props.user,channel);
        props.selectChannel(channel);
    }

    const setLastVisited = (user, channel) => {
        const userRef= child(usersRef, user.uid);
        const lvRef=child(userRef,"lastVisited");
        const lastVisitedRef = child(lvRef,channel.id);
        set(lastVisitedRef, serverTimestamp());
        onDisconnect(lastVisitedRef).set(serverTimestamp());
    }

    const onSubmit = () => {

        if (!checkIfFormValid()) {
            return;
        }

        const key=push(channelsRef).key;

        const channel = {
            id: key,
            name: channelAddState.name,
            description: channelAddState.description,
            created_by: {
                name: props.user.displayName,
                avatar: props.user.photoURL
            }
        }
        setLoadingState(true);
        update(ref(database,'channels/'+key),channel)
            .then(() => {
                setChannelAddState({ name: '', description: '' });
                setLoadingState(false);
                console.log('saved')
                closeModal();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return <> <Menu.Menu style={{ marginTop: '35px' }}>
        <Menu.Item style={{ fontSize: '15px' ,fontWeight: 'bold',
fontStyle: 'italic' ,fontFamily: "Helvetica, sans-serif"}}>
            <span>
            <Icon name="globe" />CHANNELS
            </span>
        </Menu.Item>
        {displayChannels()}
        <Menu.Item >
            <span className="clickable" onClick={openModal} style={{fontWeight: 'bold',fontFamily: "Helvetica, sans-serif"}}  >
                <Icon name="add" /> ADD CHANNEL
            </span>
        </Menu.Item>
    </Menu.Menu>
        <Modal open={modalOpenState} onClose={closeModal}>
            <Modal.Header style={{color:"#adefd1ff" ,background:"#00203FFF" }}>
                Create Channel
            </Modal.Header>
            <Modal.Content style={{background:"#00203FFF" }}>
                <Form onSubmit={onSubmit}>
                        <Form.Input
                            name="name"
                            value={channelAddState.name}
                            onChange={handleInput}
                            type="text"
                            placeholder="Enter Channel Name"
                        />
                        <Form.Input
                            name="description"
                            value={channelAddState.description}
                            onChange={handleInput}
                            type="text"
                            placeholder="Enter Channel Description"
                        />
                </Form>
            </Modal.Content>
            <Modal.Actions style={{background:"#00203FFF" }}>
                <Button loading={isLoadingState} onClick={onSubmit} basic color='teal' >
                    <Icon name="save" /> Save
                </Button>
                <Button onClick={closeModal} basic color='teal' >
                    <Icon name="remove"/> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    </>
}
const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Channels);