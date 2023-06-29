import React from 'react'
import "./Loader.css"
import { Dimmer,Loader } from 'semantic-ui-react'
const AppLoader = (props) => {
    return (<Dimmer active={props.loading}>
        <Loader size="huge" content="Please Wait" />
    </Dimmer>)
}

export default AppLoader