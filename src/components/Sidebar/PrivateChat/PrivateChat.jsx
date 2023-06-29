import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {database,ref,onChildAdded,off,onValue,onDisconnect,child,set,onChildRemoved,serverTimestamp} from "../../../server/firebase";
import { Menu, Icon} from 'semantic-ui-react';
import { setChannel } from "../../../store/actioncreator"
import { Notification } from "../Notification/Notification";

const usersRef = (ref(database,'users/'));
const connRef = (ref(database,'.info/connected/'));
const statusRef=(ref(database,'status'));
const PrivateChat = (props) => {

    const [usersState, setUsersState] = useState([]);
    const [connectedUsersState, setConnectedUsersState] = useState([]);

    useEffect(() => {
        onChildAdded((usersRef),(snap) => {
            setUsersState((currentState) => {
                let updatedState = [...currentState];

                let user = snap.val();
                user.name = user.displayName;
                user.id = snap.key;
                user.isPrivateChat = true;

                updatedState.push(user);             
                return updatedState;
            })
        });
        onValue(connRef, (snap) => {
            if (props.user && snap.val()) {
              const userStatusRef = child(statusRef, props.user.uid);
              set(userStatusRef, true);
              onDisconnect(userStatusRef).set(null);
            }
        })


        return () => {off(usersRef); off(connRef);}
        
    }, [props.user])

    useEffect(() => {
        onChildAdded((statusRef),(snap) => {
            setConnectedUsersState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.key);             
                return updatedState;
            })
        });
        onChildRemoved((statusRef),(snap) => {
            setConnectedUsersState((currentState) => {
                let updatedState = [...currentState];
                let index = updatedState.indexOf(snap.key);
                updatedState.splice(index, 1);
                return updatedState;
            })
        });

        return () => off(statusRef);;
    }, [usersState]);

    const displayUsers = () => {
        if (usersState.length > 0) {
            return usersState.filter((user) => user.id !== props.user.uid).map((user) => {
                return <Menu.Item
                    key={user.id}
                    name={user.name}
                    onClick={() => selectUser(user)}
                    active={props.channel && generateChannelId(user.id) === props.channel.id}
                >
                    <Icon name="rss" color={`${connectedUsersState.indexOf(user.id) !== -1 ? "green" : "grey"}`} />
                    <Notification user={props.user} channel={props.channel}
                        notificationChannelId={generateChannelId(user.id)}
                        displayName={user.name} />
                </Menu.Item>
            })
        }
    }
    const selectUser = (user) => {
        let userTemp = { ...user };
        userTemp.id = generateChannelId(user.id);
        setLastVisited(props.user, props.channel);
        setLastVisited(props.user, userTemp);
        props.selectChannel(userTemp);
    }
    const setLastVisited = (user, channel) => {
        const userRef= child(usersRef, user.uid);
        const lvRef=child(userRef,"lastVisited");
        const lastVisitedRef = child(lvRef,channel.id);
        set(lastVisitedRef, serverTimestamp());
        onDisconnect(lastVisitedRef).set(serverTimestamp());
    }


    const generateChannelId = (userId) => {
        if (props.user.uid < userId) {
            return props.user.uid + userId;
        }
        else {
            return userId + props.user.uid; //so that channel id is same for both sides
        }
    }



    return <Menu.Menu style={{ marginTop: '35px' }}>
        <Menu.Item style={{ fontSize: '15px' ,fontWeight: 'bold',
fontStyle: 'italic' ,fontFamily: "Helvetica, sans-serif"}}>
            <span>
            <Icon name="comment outline" /> DIRECT MESSAGE
            </span>
        </Menu.Item>
        {displayUsers()}
    </Menu.Menu>
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


export default connect(mapStateToProps,mapDispatchToProps)(PrivateChat);