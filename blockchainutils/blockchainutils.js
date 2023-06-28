"use strict";

const { Wallets, Gateway } = require("fabric-network");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const logger = require("./logger");

const FabricCAServices = require("fabric-ca-client");

class BlockchainUtils {
  constructor() {
    this.gateway = new Gateway();

    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "../",
      "connection-profile",
      "ccp.json"
    );
    this.ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    this.walletPath = path.resolve(__dirname, "../wallet");
  }

  async createInstance(user, requestType) {
    await this.enrollAdmin();
    await this.registerUser(user);

    const discoveryEnabled = true;
    const discoveryAsLocalhost = false;
   

    // switch (requestType) {
    //   case "record":
    let  channelName = 'chesst-channel';
    let  chaincode = requestType;
    //     break;
    //   /*
    //           case 'assessment':                
    //             channelName = process.env.ASSESSMENT_CHANNEL_NAME;
    //             chaincode = process.env.ASSESSMENT_DEPLOYED_CHAINCODE;
    //             break;
    //             case 'key':                  
    //             channelName = process.env.ASSESSMENT_CHANNEL_NAME;
    //             chaincode = process.env.KEY_DEPLOYED_CHAINCODE;
    //             break;
    //   */          
    //   default:
    //     logger.info("Invalid Request Type ");
    // }

    try {
      // Check to see if we've already enrolled the user.
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      const ccp = this.ccp;

      const identity = await wallet.get(user);
      if (!identity) {
        logger.info(
          `An identity for the user ${user} does not exist in the wallet`
        );
        logger.info(`Please Register user : ${user}`);
        throw new Error(
          `An identity for the user ${user} does not exist in the wallet`
        );
      }
	//console.log("*************************",ccp);
	    //console.log("******************",identity);
      // Create a new gateway for connecting to our peer node.
      await this.gateway.connect(ccp, {
        wallet,
        identity: user,
        discovery: {
          enabled: discoveryEnabled,
          asLocalhost: discoveryAsLocalhost
	},
	  url:'grpcs://nd-j3nnlnadyvclbonjwtvyhxipu4.m-qsaws6vsknceje6dy3d33t7x2y.n-d3kz7ntvebc4xfimky4v3mpntm.managedblockchain.us-east-1.amazonaws.com:30003'
        
      });

      // Get the network (channel) our contract is deployed to.
      const network = await this.gateway.getNetwork(channelName);

      //console.log("Network", network);

      return network.getContract(chaincode);
    } catch (err) {
      err.status = "Fail";
      throw err;
    }
  }

  async disconnect() {
    this.gateway.disconnect();
  }

  async enrollAdmin() {
    try {
      // load the network configuration
      const ccp = this.ccp;

      // Create a new CA client for interacting with the CA.
      const caInfo = ccp.certificateAuthorities["ca-GCL-Member"];   
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caTLSCACerts, verify: false },
        caInfo.caName
      );

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);
      logger.info(`Wallet path: ${this.walletPath}`);

      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get("admin");
      if (identity) {
        logger.info(
          `An identity for the admin user "admin" already exists in the wallet`
        );
        return;
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
        enrollmentID: "admin",
        enrollmentSecret: "Admin123",
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: ccp.organizations["user1"].mspid,  
        type: "X.509",
      };
      await wallet.put("admin", x509Identity);
      logger.info(
        `Successfully enrolled admin user "admin" and imported it into the wallet`
      );
    } catch (error) {
      logger.error(`Failed to enroll admin user "admin": ${error}`);
      process.exit(1);
    }
  }

  async registerUser(userid) {
    try {
      // load the network configuration
      const ccp = this.ccp;

      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities["ca-GCL-Member"].url;    
      const ca = new FabricCAServices(caURL);

      // Create a new file system based wallet for managing identities.
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(userid);
      if (userIdentity) {
        logger.info(
          `An identity for the user ${userid} already exists in the wallet`
        );
        return;
      }

      // Check to see if we've already enrolled the admin user.
      const adminIdentity = await wallet.get("admin");
      if (!adminIdentity) {
        logger.info(
          `An identity for the admin user "admin" does not exist in the wallet`
        );
        logger.info("Run the enrollAdmin.js application before retrying");
        return;
      }

      // build a user object for authenticating with the CA
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, "admin");
      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register(
        {
          enrollmentID: userid,
          role: "client",
          maxEnrollments: -1,
        },
        adminUser
      );
      const enrollment = await ca.enroll({
        enrollmentID: userid,
        enrollmentSecret: secret,
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: ccp.organizations["user1"].mspid,    
        type: "X.509",
      };

      await wallet.put(userid, x509Identity);
      logger.info(
        `Successfully registered and enrolled  user ${userid} and imported it into the wallet`
      );

      return secret;
    } catch (error) {
      logger.error(`Failed to register user ${userid}: ${error}`);
    }
  }
}

//main().catch(console.error);

module.exports = {
  BlockchainUtils,
};














/*
async function main() {
  try {
    // Load connection profile and wallet
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Specify the username of the identity to use
    const userName = 'user1';

    // Create a new gateway for connecting to the network
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userName,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Access the network and contract
    const network = await gateway.getNetwork('<channel-name>');
    const contract = network.getContract('<chaincode-name>');

    // Invoke the chaincode functions
    const contractID = 'CONTRACT_ID';
    const contractHash = 'CONTRACT_HASH';
    const contractType = 'CONTRACT_TYPE';
    const playerName = 'PLAYER_NAME';
    const activeFrom = new Date('2023-01-01');
    const location = 'LOCATION';
    const uploadedBy = 'UPLOADED_BY';
    const recordedDate = new Date('2023-06-01');

    // Create a new contract
    await contract.submitTransaction(
      'CreateContract',
      contractID,
      contractHash,
      contractType,
      playerName,
      activeFrom.toISOString(),
      location,
      uploadedBy,
      recordedDate.toISOString()
    );
    console.log('Contract created successfully');

    // Query the contract details
    const result = await contract.evaluateTransaction('QueryContract', contractID);
    const contractDetails = JSON.parse(result.toString());
    console.log('Contract details:', contractDetails);

    // Approve the contract
    const approver = 'APPROVER';
    const reason = 'APPROVAL_REASON';
    await contract.submitTransaction('ApproveContract', contractID, approver, reason);
    console.log('Contract approved successfully');

    // Disconnect from the gateway
    gateway.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}
*/

