/*
 * Copyright (c) 2018, fpsVisionary Software. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * Please contact fpsVisioanry Software, Am Sutdio 2A, 12527 Berlin
 * or visit www.fpsvisionary.com if you need additional information or have any
 * questions.
 */
import React, { Component } from 'react';
/**
 * moment - Library
 * Extensions for better Time & Date handling
 */
import moment from 'moment';
//For awesome font css and icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt)
/**
 * ListItem Class
 * This class handles the ListItems of each Contact
 * The zindex will be customized as the first Element needs to be on top of all 
 * There are some special behavoir on Next and Current Client
 * @author Nico Friedrich <n.friedrich@cipico.de>
 * @version 1.0
 * @since 1.0
 * @see ListItem
 * @see Component
 */
class ListItem extends Component {
    render() {
      var listClass = `list-item card ${this.props.view}`;
      var style = { zIndex: 100 - this.props.index };
      var additionalText = "";
      ///Next Client
      if (this.props.index === 0) {
        //Make the background red
        style.background = "red";
  
      }
      //This is when the client is on the cash of an employer
      if(this.props.mode === this.props.siteMode.onCurrent && this.props.index in this.props.current){
        //Make this green background and append the cash number
        listClass += " currentContact";
        additionalText += " an der Kasse:" + this.props.current[this.props.index];
      }
      ///Finaly Render
      return (
          <li id={this.props.id} className={listClass} style={style}>
            <h3>{this.props.card_id}{additionalText}</h3>
            <h5>{moment(this.props.timestamp).format('MMM Do, YYYY')}</h5>
            <button onClick={this.props.clickHandler}>
              <FontAwesomeIcon icon="trash-alt" />
            </button>
          </li>
  
      )
    }
  }

  export default ListItem;