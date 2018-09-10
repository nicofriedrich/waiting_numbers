
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
import { faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt,faCheck)

/**
 * ListPickupItem Class
 * This class handles the ListPickupItem of each Contact
 * The zindex will be customized as the first Element needs to be on top of all 
 * There are some special behavoir on Next and Current Client
 * @author Nico Friedrich <n.friedrich@cipico.de>
 * @version 1.0
 * @since 1.0
 * @see ListPickupItem
 * @see Component
 */
class ListPickupItem extends Component {
    render() {
      var listClass = `list-item card ${this.props.view}`;
      var style = { zIndex: 100 - this.props.index };
      var additionalText = "";
      ///Finaly Render
      return (
          <li id={this.props.id} className={listClass} style={style}>
            <h3>{this.props.id} --> {this.props.display_name}</h3>
            <button onClick={this.props.clickHandler}>
              <FontAwesomeIcon icon="check" />
            </button>
          </li>
  
      )
    }
  }
  export default ListPickupItem;