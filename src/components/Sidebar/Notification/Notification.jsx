import React, { useState, useEffect } from 'react';
import { Label } from 'semantic-ui-react';

import {database,ref,onValue,child} from "../../../server/firebase";
export const Notification = (props) => {

    

    const [channelsVisitedState, setChannelsVisitedState] = useState({});
    const [messagesTimeStampState, setMessagesTimeStampState] = useState({});


    useEffect(() => {
        const messagesRef = ref(database,"messages");
        const usersRef = ref(database,"users");
        if (props.user) {
            const userRef=child(usersRef,props.user.uid)
            const lastVisitedRef = child(userRef, "lastVisited");

            onValue(lastVisitedRef, (snap) => {
                setChannelsVisitedState(snap.val());
            })

            onValue(messagesRef, (snap) => {
                let messages = snap.val();
                let channelsId = Object.keys(messages);
                let messagesTimeStamp = {};
                channelsId.forEach((channelId) => {
                    let channelMessageKeys = Object.keys(messages[channelId]);
                    
                    channelMessageKeys.reduce((agg, item) => {
                      messagesTimeStamp[channelId] = [...messagesTimeStamp[channelId] || []];
                      messagesTimeStamp[channelId].push(messages[channelId][item].timestamp);
                      
                      return agg; // Return the accumulator (agg)
                    }, null); // Set an initial value for the accumulator
                  });
                setMessagesTimeStampState(messagesTimeStamp);
            })
        }
    }, [props.user]);

    const calculateNotificationCount = (channelId) => {

        if (channelsVisitedState && messagesTimeStampState && props.channel && props.channel.id !== channelId) {

            let lastVisited = channelsVisitedState[channelId];

            let channelMessagesTimeStamp = messagesTimeStampState[channelId];

            if (channelMessagesTimeStamp) {
                let notificationCount = channelMessagesTimeStamp.filter(timestamp => !lastVisited || lastVisited < timestamp).length;
                return notificationCount === 0 ? null : <Label circular size='mini' color="teal">{notificationCount}</Label>
            }
        }

        return null;
    }

    return <> {props.displayName}{calculateNotificationCount(props.notificationChannelId)} </>;

}
