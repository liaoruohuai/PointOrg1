/*
SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const nowPoint = require('../pscontract/lib/point.js');

// A wallet stores a collection of identities for use
//const wallet = new FileSystemWallet('../user/isabella/wallet');
const wallet = new FileSystemWallet('../identity/user/Randall/wallet');

// Main program function
async function main() {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    // Specify userName for network access
    // const userName = 'isabella.issuer@magnetocorp.com';
    const userName = 'User1@org1.points.com';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled:false, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');

    await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: cpchannel.');

    const network = await gateway.getNetwork('cpchannel');

    // Get addressability to commercial paper contract
    console.log('Use org.pointnet.point smart contract.');

    const contract = await network.getContract('pointcontract', 'org.pointnet.point');

    // issue commercial paper
    console.log('Submit customer point cancel transaction.');

    const issueResponse = await contract.submitTransaction('cancel','HuiJin', 'apple', '13611819694', '1000', '1550935885233', Date.now().toString());

    // process response
    console.log('Process cancel transaction response.');

    let point = nowPoint.fromBuffer(issueResponse);

    console.log(`${point.shop} customer point : ${point.phone} successfully been cancel at time ${point.updateTime}`);
    console.log('Transaction complete.');

  } catch (error) {

    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);

  } finally {

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.');
    gateway.disconnect();

  }
}
main().then(() => {

  console.log('New program complete.');

}).catch((e) => {

  console.log('New program exception.');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);

});
