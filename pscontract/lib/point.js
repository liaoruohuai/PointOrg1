/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate point state values
const pointState = {
    New: 1,
    Used: 2,
    Cancel: 3
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Point extends State {

    constructor(obj) {
        super(Point.getClass(), [obj.mall, obj.shop, obj.phone, obj.count]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */

    getMall() {
        return this.mall;
    }

    getShop() {
        return this.shop;
    }



    setPhone(phone) {
        this.phone = phone;
    }


    getPhone() {
        return this.phone;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setNew() {
        this.currentState = pointState.New;
    }

    setUsed() {
        this.currentState = pointState.Used;
    }

    setCancel() {
        this.currentState = pointState.Cancel;
    }

    isNew() {
        return this.currentState === pointState.New;
    }

    isUsed() {
        return this.currentState === pointState.Used;
    }

    isCancel() {
        return this.currentState === pointState.Cancel;
    }

    static fromBuffer(buffer) {
        return Point.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Point);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(mall, shop, phone, count, createTime, updateTime) {
        return new Point({ mall, shop, phone, count, createTime, updateTime });
    }

    static getClass() {
        return 'org.pointnet.point';
    }
}

module.exports = Point;
