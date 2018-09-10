/*
 * Copyright (c) 2018, fpsVisionary Software. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Please contact fpsVisioanry Software, Am Sutdio 2A, 12527 Berlin
 * or visit www.fpsvisionary.com if you need additional information or have any
 * questions.
 */

/**
 * swal - library react
 * A special library for displaying alert messages with confirmation handler
 */
import swal from 'sweetalert';
import throttle from 'lodash/throttle';

/**
 * CIPWebSocket - Class
 * This class hanles all communication for the WebService handling
 * it holds the app as property
 * @author Nico Friedrich <n.friedrich@cipico.de>
 * @version 1.0
 * @since 1.0
 */
class CIPWebSocket {
    constructor(app, url, siteMode) {
        this.app = app;//Initial init WebSocket
        //TODO:There should be a better way to integrate Websocket in React?
        this.socket = new WebSocket(url);
        this.initWebSocketDeletages(siteMode);
    }

    initWebSocketDeletages(siteMode) {
        var self = this.app;
        /**
         * onopen - function
         * On Open the WebSocket
         */
        this.socket.onopen = function (evt) {
            console.log("open webSocket");
            //Say hello to Server!
            this.send("WAIT");
        }

        /**
         * onmessage - function
         * Called on received Message
         */
        this.socket.onmessage = function (evt) {
            //Assumes a JSON from Server
            //TODO:TryCatch?
            var response = JSON.parse(evt.data);
            if (response.is_error === 0) {
                //There is no Error
                if (response.entity === "Contacts") {
                    //Contact Entity
                    if (response.action === "get") {
                        //This is when we get all contact as an Array
                        //No set the new State OnData
                        if(self.state.pickup_place in response.values && response.values[self.state.pickup_place].length > 0){
                            self.setState({
                                offset:response.offset,
                                mode: siteMode.onData, //new mode
                                contacts: response.values[self.state.pickup_place], //all contacts
                                removedContacts: [], //array of removed Contacts
                                view: 'list', //state of view
                                order: 'asc',//order asc
                                sortingMethod: 'chronological', //FlipMove method
                            });
                        }
                        
                    }
                }
                if (response.entity === "PickupContact") {
                    //This is called when customer is on cash from Employer 
                    if (response.action === "current") {
                        //The customer is scanned per card_id
                        self.setState({
                            mode: siteMode.onCurrent, //onCurrent State
                            current: response.current //gives a dict {idx:cash_nr} (could be more than one key/idx)
                        });
                    }
                    if (response.action === "close") {
                        //This is called when customer is finally finished
                        //First copy the value to tmp dict / array
                        var tmpCurrent = self.state.current;
                        var tmpContacts = self.state.contacts;
                        //delete the closed customer
                        delete tmpCurrent[response.current];
                        tmpContacts.splice(response.current, 1);
                        //Hanlde smooth delete
                        throttle(() => this.removeContact('contacts', 'removedContacts',
                            self.state.contacts[response.current]['id']), 800)
                        //Set the new Sate onData
                        var mode = siteMode.onData;
                        if (tmpContacts.length == 0) {
                            //there are no more contacts => State is idle
                            mode = siteMode.idle;
                        }
                        //Finally set all state properties
                        self.setState({
                            contacts: tmpContacts,
                            current: tmpCurrent,
                            mode: mode

                        });
                    }
                }
            }
            else {
                //FIXME:Better ErrorHandling
                swal({
                    icon: "error",
                    title: "Fehler",
                    text: response.error_message
                });
            }
        }

        /**
         * onclose - function
         * Called if the webSocket was closed
         * Handles an error
         * @param {obj} evt Event
         */
        this.socket.onclose = function (evt) {
            console.log("close webSocket");
            swal({
                icon: "error",
                title: "Verbindung wurde geschloosen",
                text: "Verbindung konnte nicht hergestellt werden. Bitte versuchen Sie es später erneut."
            });
            self.setState({
                mode: siteMode.error
            });
        }

        /**
         * onerror - function
         * Called if the webSocket has an error
         * //TODO: onclose is also called this seams to be obsolete
         * Handles an error
         * @param {obj} evt Event
         */
        this.socket.onerror = function (evt) {
            console.log("error");
            self.setState({
                mode: siteMode.error
            });
        }
    }
}
export default CIPWebSocket;