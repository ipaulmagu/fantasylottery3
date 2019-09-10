import React, { Component } from "react";
import M from "materialize-css";
import logoGoogle from "../google.svg";
import logoFB from "../facebook.svg";
import "./lottery.css";
import { connect } from "react-redux";
import * as ACTIONS from "../store/actions";

import {
  firebase,
  auth,
  signInWithGoogle,
  signInWithGoogleRedirect,
  signInWithFB,
  signInWithFBRedirect
} from "../firebase";

export class DlgAuth extends Component {
  constructor(props) {
    super(props);
    this.signInWithGoogle = signInWithGoogle;
    this.signInWithGoogleRedirect = signInWithGoogleRedirect;
    this.signInWithFB = signInWithFB;
    this.signInWithFBRedirect = signInWithFBRedirect;
    this.state = { isSignup: true };
    this.auth = auth;
    this.firebase = firebase;
    this.hLoginSignupGoogle = this.hLoginSignupGoogle.bind(this);
    this.hLoginSignupFB = this.hLoginSignupFB.bind(this);
    this.hSignInError = this.hSignInError.bind(this);
  }
  componentDidMount() {
    // let elDlgAuth = document.getElementById(this.props.dlgID);
    // this.oDlgAuth = M.Modal.getInstance(elDlgAuth);
    this.unsubscribeAuth = this.auth.onAuthStateChanged((user, b, c, d) => {
      console.log(`Signing IN.... ${!user ? "(No user)" : "Success"}`);
      // alert("Signing in....");
      let un = !user ? "guest" : user.displayName.split(" ")[0];
      let msg = !user
        ? `Welcome ${un}!<br> ...more features, when you login!`
        : `Hi ${un}!<Br> &nbsp &nbsp welcome back!`;
      // if (user) {
      M.toast({
        html: msg,
        classes: "rounded green lighten-4 black-text",
        displayLength: !user ? 5000 : 2000
      });
      // }
      this.props.onMaxDrawingsSet(!user ? 10 : 30);
      this.props.onUserNew(user);
      let dlg = this.props.oDlgAuth;
      if (dlg && dlg.isOpen) dlg.close();
      // this.setState({ isLoggedIn: !!user, user });
    });
  }
  componentWillUnmount() {
    if (this.unsubscribeAuth) this.unsubscribeAuth();
  }
  hSignInError = sProviderID => {
    this.auth.getRedirectResult().then(
      res => {
        //   M.toast({
        //     html: `Success('${sProviderID}') ${res}`,
        //     classes: "red black-text lighten-3",
        //     displayLength: 14000
        //   });
        console.log(`*** Success('${sProviderID}'):`, res, res.user);
      },
      error => {
        let smsg = `*** Error '${error.code}':'${error.message}'`;
        // console.log(smsg);
        if (error.code === "auth/account-exists-with-different-credential") {
          auth
            .fetchSignInMethodsForEmail(error.email)
            .then(function(providers) {
              // The returned 'providers' is a list of the available providers
              // linked to the email address. Please refer to the guide for a more
              // complete explanation on how to recover from this error.
              let s = `Error(${sProviderID}) logging in: '${error.code}'`;
              console.log(s);
              // alert(s);
              M.toast({
                html: s,
                classes: "red black-text lighten-3",
                displayLength: 14000
              });
              M.toast({
                html: `Hint! Did you meen to log in with '${providers.join(", or ")}'?`,
                classes: "rounded orange lighten-3 black-text",
                displayLength: 19000
              });
            })
            .catch(err2 => {
              console.log(`*** Error:${err2}`);
            });
        } //if email was used on other account
        else {
          console.log("*** Error " + smsg);
          alert(smsg);
        }
      }
    );
  };
  hLoginSignupGoogle = ev => {
    try {
      this.signInWithGoogle();
      this.hSignInError("Google");
    } catch (error) {
      console.log("**** [DlgAuth.hLoginSignupGoogle].Error:", error);
    }
  };
  hLoginSignupFB = ev => {
    try {
      this.signInWithFB();
      this.hSignInError("FB");
    } catch (error) {
      console.log("**** [DlgAuth.hLoginSignupFB].Error:", error);
    }
  };
  render() {
    // let sOpType = this.state.isSignup ? "Signup" : "Login";
    return (
      <div>
        {/* Modal Trigger */}
        {/* <a className="waves-effect waves-light btn modal-trigger" href="#idDlgAuthentication">
          Authentication
        </a> */}

        {/* Modal Structure */}
        <div id={this.props.dlgID} className="modal">
          <div className="modal-header AuthDlg">
            <h5>Sign Up / Log in</h5>
          </div>
          <div className="modal-content">
            {/* <h5>Sign Up / Log in</h5>
            <p>{sOpType} Using</p> */}
            <ul className="collapsible">
              <li>
                <div className="collapsible-header">
                  <a href="#!" className="brand-logo" onClick={this.hLoginSignupGoogle}>
                    <img className="LogoSocial" src={logoGoogle} alt="Google" />
                    Google
                  </a>
                </div>
                {/* <div className="collapsible-body">
                  <span>Lorem ipsum dolor sit amet.</span>
                </div> */}
              </li>
              <li>
                <div className="collapsible-header">
                  <a href="#!" className="brand-logo" onClick={this.hLoginSignupFB}>
                    <img className="LogoSocial" src={logoFB} alt="Facebook" />
                    Facebook
                  </a>
                </div>
                {/* <div className="collapsible-body">
                  <span>Lorem ipsum dolor sit amet.</span>
                </div> */}
              </li>
              <li>
                <div className="collapsible-header">
                  <a href="#!" className="brand-logo">
                    <i className="material-icons">email</i>
                    Email/Password
                  </a>
                </div>
                <div className="collapsible-body">
                  <span>Lorem ipsum dolor sit amet.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-close waves-effect waves-green btn-flat">
              Close
            </a>
          </div>
        </div>
      </div>
    );
  }
}
const mapState2Props = state => {
  // console.log("[LotteryHeader.mapState2Props].state", state);
  // return { game: state.gm.game, maxDrawings: state.gm.maxDrawings, strategies: state.gm.strategies };
  return { user: state.user, maxDrawings: state.maxDrawings };
};
const mapDispatch2Props = dispatch => {
  // console.log("[LotteryHeader.mapDispatch2Props].dispatch");
  return {
    onMaxDrawingsSet: v => dispatch(ACTIONS.onMaxDrawingsSet(v)),
    onUserNew: v => dispatch(ACTIONS.onUserNew(v))
  };
};
export default connect(
  mapState2Props,
  mapDispatch2Props
)(DlgAuth);
