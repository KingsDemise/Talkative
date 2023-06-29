import React from 'react';
import { connect } from 'react-redux';
import { Icon, Menu} from 'semantic-ui-react';
import { setChannel } from "../../../store/actioncreator"

const Favourite = (props) => {

    const displayChannels = () => {
        if (Object.keys(props.favouriteChannels).length > 0) {
            return Object.keys(props.favouriteChannels).map((channelId) => {
                return <Menu.Item
                    key={channelId}
                    name={props.favouriteChannels[channelId]}
                    onClick={() => props.selectChannel({ id: channelId, name: props.favouriteChannels[channelId] , isFavourite : true })}
                    active={props.channel && channelId === props.channel.id && props.channel.isFavourite}
                >
                    {props.favouriteChannels[channelId]}
                </Menu.Item>
            })
        }
        else
        {
            return <Menu.Item >
                <p style={{ fontSize: '12px' ,
            fontStyle: 'italic',color:'grey',fontFamily: "Arial, sans-serif"}}>Your favourite channels appear here</p>
            </Menu.Item>
                    
        }
    }
    return <Menu.Menu style={{ marginTop: '35px' }}>
        <Menu.Item style={{ fontSize: '14px' ,fontWeight: 'bold',
fontStyle: 'italic' ,fontFamily: "Helvetica, sans-serif"}}>
            <span>
            <Icon name="star outline" />STARRED CHANNELS
            </span>
        </Menu.Item>
        {displayChannels()}
    </Menu.Menu>
}
const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        favouriteChannels: state.favouriteChannel.favouriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Favourite);