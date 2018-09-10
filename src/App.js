/*
 * Copyright (c) 2018, fpsVisionary Software. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Please contact fpsVisioanry Software, Am Sutdio 2A, 12527 Berlin
 * or visit www.fpsvisionary.com if you need additional information or have any
 * questions.
 */

import React, { Component } from 'react';
///Some logos end error symbols
import logo from './cipico_logo.png';
import reactLogo from './logo.svg';
import error_symbol from './error_symbol.svg';
import axios from 'axios';

//Import own Objects
import ListItem from './ListItem';
import ListPickupItem from './ListItem';
import CIPWebSocket from './WebSocket';


/**
 * FlipMove - Library
 * this library is for a better (nice) table display and animation
 * Everytime a Customer is closed there will be a nice animation to do this
 * throttle is also for a better animation of remove and adding this ListItems
 */
import FlipMove from 'react-flip-move';
import throttle from 'lodash/throttle';
import swal from 'sweetalert';


/**
 * Our Css Files for HTML design
 */
import './App.css';
import './Style.css';
import './FlipMove.css';
import './list_create.css';
import './jquery-confirm.css';
import './fpsHelper.min.css';

/**
 * siteMode - current SITE MODE
 * as ENUM
 */
const siteMode = {
  pickup: 6,
  idle: 0,
  ready: 1,
  busy: 2,
  error: 3,
  onData: 4,
  onCurrent: 5
}

/**
 * App - Class
 * This class handles the hole Logic of WaitNumbers Sytem
 * It has a websocket connection and changes between the different states
 * @author Nico Friedrich <n.friedrich@cipico.de>
 * @version 1.0
 * @since 1.0
 */
class App extends Component {

  /**
   * constructor - contrcutor
   * Inits all necessary Objects like the WebServer etc 
   * @param {Obj} props 
   */
  constructor(props) {
    super(props);
    // //Init WebSocket
    // this.socket = new CIPWebSocket(this,"ws://demo.cento.fps:4438/ws/wait_numbers/",siteMode);
    //Inital State
    this.state = {
      title: "WarteSystem",
      mode: siteMode.pickup,
      // socket: this.socket,
      pickup_place:null,
      pickup_places:[]
    };
    axios.get("http://demo.cento.fps/sites/default/civicrm-extensions/com.fpsvisionary.essensausgabe/Ausgabe_Modul/ausgabe.php").then(function(response){
        if(response.data.is_error == 0){
          //handle display
        }
        else{
          swal({
            icon: "error",
            title: "Fehler",
            text: response.data.error_message
          });
        }
      }).catch(function (error) {
        // handle error
        console.log(error);
        swal({
            icon: "error",
            title: "Fehler",
            text: error.message
        });
      });
    document.title = "CIPICO " + this.state.title;

  }
  /**
   * removeContact - function
   * Called when a contact should be removed
   * @param {string} source 
   * @param {string} dest 
   * @param {int} id 
   */
  removeContact(source, dest, id) {
    const sourceContacts = this.state[source].slice();
    let destContacts = this.state[dest].slice();

    if (!sourceContacts.length) return;

    // Find the index of the contact clicked.
    // If no ID is provided, the index is 0
    const i = id ? sourceContacts.findIndex(contact => contact.id === id) : 0;

    // If the contact is already removed, do nothing.
    if (i === -1) return;

    destContacts = [].concat(sourceContacts.splice(i, 1), destContacts);

    //Set new state
    this.setState({
      [source]: sourceContacts,
      [dest]: destContacts,
    });
  }
  /**
   * renderContacts - function
   * Helper for rendering the contacts in ListItems
   * Pass all args for listitems like mode etc
   */
  renderContacts() {
    return this.state.contacts.map((contact, i) => {
      return (
        <ListItem
          key={contact.id}
          view={this.state.view}
          index={i}
          mode={this.state.mode}
          current={this.state.current}
          siteMode={siteMode}
          clickHandler={throttle(() => this.removeContact('contacts', 'removedContacts', contact.id), 800)}
          {...contact}
        />
      );
    });
  }

  renderPickupPlaces(){
    return this.state.pickup_places.map((aPlace, i) => {
      return (
        <ListPickupItem
          key={aPlace.id}
          view={this.state.view}
          index={i}
          mode={this.state.mode}
          current={this.state.current}
          siteMode={siteMode}
          clickHandler={throttle(() => this.removeContact('contacts', 'removedContacts', aPlace.id), 800)}
          {...aPlace}
        />
      );
    });
  }

  /**
   * render - App Rendering Function
   * Finally renders the hole app 
   */
  render() {
    //First touch on inline CSS
    var padding_5 = {
      paddingTop: "5px"
    }
    var padding_0 = {
      paddingLeft: "0px !important"
    }
    //Letz define some vars that should fill dynamically
    var title;
    var description;
    var body;
    //Swich for important states
    switch (this.state.mode) {
      case siteMode.pickup:
        //Idle State (Website is waiting on input)
        title = <h1>Willkommen zum Tafel WarteSystem</h1>;
        description = <div className="wait_desc">Bitte wählen Sie zunächst die Ausgabestelle.</div>
        body = <div className="wait_body"><img src={reactLogo} className="App-logo" alt="logo" /></div>
        if (this.state.pickup_places.length > 0){
          <FlipMove
            staggerDurationBy="30"
            duration={500}
            enterAnimation={this.state.enterLeaveAnimation}
            leaveAnimation={this.state.enterLeaveAnimation}
            typeName="ul">
            {this.renderPickupPlaces()}
          </FlipMove>
        }
        break;
      case siteMode.idle:
        //Idle State (Website is waiting on input)
        title = <h1>Willkommen zum Tafel WarteSystem</h1>;
        description = <div className="wait_desc">Syncronistation ist ausstehend. Bitte übertragen Sie eine Liste in der Ausgabe.</div>
        body = <div className="wait_body"><img src={reactLogo} className="App-logo" alt="logo" /></div>
        break;
      case siteMode.error:
        //Error State (Website has an Error)
        //TODO:What is about to refresh the site after a while? 
        title = <h1>Verbindungsfehler</h1>;
        description = <div className="wait_desc">Es gibt ein Problem mit der Verbindung.</div>
        body = <div className="wait_body"><img src={error_symbol} className="App-logo" alt="logo" /></div>
        break;
      case siteMode.onData:
      case siteMode.onCurrent:
        //General OnData / Current new state of customer
        title = <h1>Willkommen zum Tafel WarteSystem</h1>;
        var classes = "next";
        if (this.state.mode === siteMode.onCurrent) {
          classes = "currentContactID"
        }
        description = <div className={classes}>{this.state.contacts[0].card_id}</div>
        body = <div id="shuffle" className={this.state.view}>
          <header>
            <div className="abs-left" />
          </header>
          <FlipMove
            staggerDurationBy="30"
            duration={500}
            enterAnimation={this.state.enterLeaveAnimation}
            leaveAnimation={this.state.enterLeaveAnimation}
            typeName="ul">
            {this.renderContacts()}
          </FlipMove>
        </div>
        break;
      default:
        break;
    }
    return (

      <div className="App">
        <header className="header">
          <ul>
            <li className="h_links" style={padding_5}>
              <a href="http://www.cipico.de" target="_blank" rel="noopener noreferrer">
                <img height="30px" src={logo} alt="logo" /></a>
            </li>
            <li className="h_links" style={padding_0}>
              <h2>{this.state.title}</h2>
            </li>
          </ul>
        </header>
        <div id="main" className="bg-wrapper">
          {title}
          {description}
          {body}
        </div>
        <div className="cip_footer" id="cipico">
          <ul>
            <li className="h_links">
              <a href="http://www.cipico.de" target="_blank" rel="noopener noreferrer"><img height="50px" src={logo} alt="logo" /></a>
            </li>
            <li className="h_links"><span className="big">Tafel Ausgabe-WarteNummern</span></li>
            <li className="h_links"><span>Version 1.0</span> </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
