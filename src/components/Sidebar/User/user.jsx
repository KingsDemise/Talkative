import React from 'react';
import { Grid, Header, Image, Dropdown } from 'semantic-ui-react';
import { connect } from "react-redux";
import {auth,signOut} from '../../../server/firebase';

import "./user.css";

const User=(props) => {

    const getDropdownOptions= () => {
        return [{
            key: 'signout',
            text: <span onClick={logOut} >Sign Out</span>
        }]
    }
    const logOut = () => {
            signOut(auth);
    }
    if (props.user) {
    return (
    <Grid>
        <Grid.Column>
            <Grid.Row className="user_grid_row">
                <Header as="h2" style={{color:"#adefd1ff"}}>
                    <Header.Content>Talkative</Header.Content>
                </Header>
                <Header inverted as="h4"><br/>
                    <Dropdown 
                        trigger={
                            <span>
                                <Image src={props.user.photoURL} avatar></Image>
                                {props.user.displayName}
                            </span>
                        }
                            options={getDropdownOptions()}
                    >
                    </Dropdown>
                            
                </Header>
            </Grid.Row>
        </Grid.Column>
    </Grid>)
}
return null;
}
const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(User);