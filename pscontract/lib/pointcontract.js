/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Point = require('./point.js');
const PointList = require('./pointlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class PointContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.pointList = new PointList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class PointContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.pointnet.point');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new PointContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log(ctx.toString());
        console.log('Instantiate the contract');
    }

    async new(ctx, mall, shop, phone, count, createTime, updateTime) {

        // create an instance of the paper
        let point = Point.createInstance(mall, shop, phone, count, createTime, updateTime);

        // Smart contract, rather than paper, moves paper into ISSUED state
        point.setNew();

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.pointList.addPoint(point);

        // Must return a serialized paper to caller of smart contract
        return point.toBuffer();
    }

    async cancel(ctx,mall, shop, phone, count, createTime, updateTime) {

        // Retrieve the current paper using key fields provided
        let pointKey = Point.makeKey([mall, shop, phone, count]);
        let point = await ctx.pointList.getPoint(pointKey);

        // Validate current owner
        if (point.getShop() !== shop) {
            throw new Error('Point ' + phone + createTime + ' is not owned by ' + shop);
        }

        // First buy moves state from ISSUED to TRADING
        if (point.isNew()) {
            point.setCancel();
            point.setUpdateTime(updateTime)
        } else {
            throw new Error('Point ' + phone + createTime + ' is not New. Current state = ' +point.getCurrentState());
        }

        // Update the paper
        await ctx.pointList.updatePoint(point);
        return point.toBuffer();
    }


}

module.exports = PointContract;
