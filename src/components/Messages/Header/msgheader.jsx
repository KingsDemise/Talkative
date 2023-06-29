import React from 'react'
import { Segment,Header, Input, Icon } from 'semantic-ui-react'
const Msgheader = (props) => {
  return (
    <Segment clearing>
        <Header floated='left' fluid='true' as='h2'>
            <span>
                {props.channelName}
                {!props.isPrivateChat && <Icon
                    onClick={props.starChange}
                    name={props.starred ? "star" : "star outline"}
                    color={props.starred ? "yellow" : "black"} />}
            </span>
            {!props.isPrivateChat && <Header.Subheader> {props.uniqueUsers} user{props.uniqueUsers===1?"":"s"}</Header.Subheader>}
        </Header>
        <Header floated='right'>
            <Input
                name='search'
                icon='search'
                placeholder='Search Messages'
                size='mini'
                onChange={props.searchTermChange}

            />
        </Header >
    </Segment>
  )
}

export default Msgheader