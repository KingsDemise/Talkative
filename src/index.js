import React,{useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "semantic-ui-css/semantic.min.css"
import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom';
import Login from './components/Auth/Login/login';
import Signup from './components/Auth/Signup/signup';
import {auth,onAuthStateChanged} from './server/firebase'
import {Provider,connect} from 'react-redux';
import {createStore} from 'redux';
import {combinedReducers} from "./store/reducer";
import {setUser} from "./store/actioncreator";
import AppLoader from './components/Loader/AppLoader';
const root=ReactDOM.createRoot(document.getElementById('root'));

const store=createStore(combinedReducers);

const Index=(props)=> {
  useEffect(()=>{
    onAuthStateChanged(auth,(user) => {
      if(user) {
        props.setUser(user);
        props.history.push("/");
      } else {
        props.setUser(null);
        props.history.push("/login");
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return (<>
  <AppLoader loading={props.loading && props.location.pathname==="/"}/>
    <Switch>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/" component={App}/>
    </Switch></>)
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    loading:state.channel.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user)=>{dispatch(setUser(user))}
  }
}

const IndexWithRouter=withRouter(connect(mapStateToProps,mapDispatchToProps)(Index));

root.render(
    <Provider store={store}>
      <Router>
        <IndexWithRouter/>
      </Router>
    </Provider>
);
