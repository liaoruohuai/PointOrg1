/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../points-network');

// A wallet stores a collection of identities
const wallet = new FileSystemWallet('../identity/user/Randall/wallet');

async function main() {

    // Main try/catch block
    try {

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/org1.points.com/users/User1@org1.points.com');
        const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org1.points.com-cert.pem')).toString();
        const key = fs.readFileSync(path.join(credPath, '/msp/keystore/60621fcd182f67b8f1e49a9f2a7d2bdfef0d5d3361fc3e85264ba6a21110585e_sk')).toString();

        // Load credentials into wallet
        const identityLabel = 'User1@org1.points.com';
        const identity = X509WalletMixin.createIdentity('Org1MSP', cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});