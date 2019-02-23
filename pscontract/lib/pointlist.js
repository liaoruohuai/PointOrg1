/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Point = require('./point.js');

class PointList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.pointnet.pointlist');
        this.use(Point);
    }

    async addPoint(point) {
        return this.addState(point);
    }

    async getPoint(pointKey) {
        return this.getState(pointKey);
    }

    async updatePoint(point) {
        return this.updateState(point);
    }
}


module.exports = PointList;
