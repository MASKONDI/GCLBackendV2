const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

var mongoose = require('mongoose');

const User = require('./models/userModel');
const Team = require('./models/teamModel');
const Player = require('./models/playerModel');
const Sponsor = require('./models/sponsorModel');
const Vendor = require('./models/vendorModel');
const Season = require('./models/seasonModel');
const Contract = require('./models/contractModel');
const TeamsPlayer = require('./models/teamsPlayerModel');
var mongoose = require('mongoose');


// const { BlockchainUtils } = require('./blockchainutils/blockchainutils');
// const blockchainUtils = new BlockchainUtils();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const uri = "mongodb+srv://maskondi2000:krishna1234@cluster0.6gtuone.mongodb.net/?retryWrites=true&w=majority";
// //const dbName ='ChessT';
const uri = 'mongodb://127.0.0.1:27017/GCLChessT';
const dbName ='GCLChessT';
const collectionName = 'contractrec';
let collection;
mongoose.connect(uri, { 
  useNewUrlParser: true 

}).then(() => console.log('DataBase connection successful'))
.catch((err) => console.log(err))


let contractJson;
let contractDetails;
let contractID;

/*******************************************************************************/
/* **************Create Contract Api With Upload Feature*********************/
/*******************************************************************************/


const storage = multer.diskStorage({
  destination: "/home/ubuntu/gclproject/gclfrontendv1/public/uploads/",
  filename: (req, file, cb) => {
    // Generate a unique filename using a hash
    if (file.mimetype == "application/pdf") {
      const hash = crypto
        .createHash("sha256")
        .update(file.originalname)
        .digest("hex");
      const ext = path.extname(file.originalname);
      const filename = `${hash+'.pdf'}`;
      cb(null, filename);
    } else {
      cb("Error: Only PDF files are allowed");
    }
  },
});

const upload = multer({ storage });


/*******************************************************************************/
/* **************Create a contract with uploaded file **************************/
/*******************************************************************************/


app.post('/createContracts',upload.single("file"),  async (req, res) => {

    console.log(req.body)
    const season = await Season.findOne({ season_year: req.body.season_year });
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }

    contractID = uuidv4().replace(/-/g, "").substring(0, 16);
    const contractFile = req.file.filename;

    // Fetch the team ID based on the team name
    if (req.body.contract_type == "Team"){
      const team = await Team.findOne({ team_name: req.body.team_name });
      
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const findContract = await Contract.findOne({ team_id: team._id });
    if (findContract) {
      const findContractSeason = await Contract.findOne({
        season_id: season._id,
      });
      if (findContractSeason) {
        return res
          .status(404)
          .json({
            error: "Contract already in exits. Please try with other teams",
          });
      }
    }
      const newContract = new Contract({
      contract_id: contractID,
      contract_token: contractFile,
      contract_type: req.body.contract_type,
      contract_file_hash: contractFile,
      team_id: team._id,
      season_id: season._id,
      season_name:season.season_name,
      season_year:season.season_year,
      contract_start_date: season.season_start_date,
      contract_end_date: season.season_end_date,
      contract_with: req.body.contract_with,
      contract_with_emailId: req.body.contract_with_emailId,
      contract_with_contact_number: req.body.contract_with_contact_number,
      contract_from_emailId: req.body.contract_from_emailId,
      contract_from_contact_number: req.body.contract_from_contact_number,
      uploaded_by: req.body.uploaded_by,
      contract_status: req.body.contract_status,
      contract_comment: req.body.contract_comment,
      is_active: req.body.is_active,
      recordDate: req.body.recordDate,
    });

    const response = addContractDetails(contractID,newContract);
    if(response) {
    newContract.save()
    .then(savedContract=> {
      res.json(savedContract);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving Team' });
    });
  }
      } else{
        res.status(500).json({ error: 'Something went wrong' });
    }

    // Fetch the player ID based on the player name
    if (req.body.contract_type == "Player"){
    const player = await Player.findOne({ player_name: req.body.player_name });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const team = await Team.findOne({ team_name: req.body.team_name });
    if (!team) {
      return res.status(404).json({ error: 'Team not found in Player' });
    }
      const newContract = new Contract({
      contract_id: contractID,
      contract_token: contractFile,
      contract_type: req.body.contract_type,
      contract_file_hash: contractFile,
      player_id: player._id,
      team_id: team._id,
      season_id: season._id,
      season_name:season.season_name,
      season_year:season.season_year,
      contract_start_date: season.season_start_date,
      contract_end_date: season.season_end_date,
      contract_with: req.body.contract_with,
      contract_with_emailId: req.body.contract_with_emailId,
      contract_with_contact_number: req.body.contract_with_contact_number,
      contract_from_emailId: req.body.contract_from_emailId,
      contract_from_contact_number: req.body.contract_from_contact_number,
      uploaded_by: req.body.uploaded_by,
      contract_status: req.body.contract_status,
      contract_comment: req.body.contract_comment,
      is_active: req.body.is_active,
      recordDate: req.body.recordDate,
    });
    const response = addContractDetails(contractID,newContract);
    if(response) {
    newContract.save()
    .then(savedContract=> {
      res.json(savedContract);
    })
    .catch(error => {
          res.status(500).json({ error: 'Error saving Team' });
    });
  }
      } else{
        res.status(500).json({ error: 'Something went wrong' });
    }

    // Fetch the sponsor ID based on the sponsor name
    if (req.body.contract_type == "Sponsor"){
    const sponsor = await Sponsor.findOne({ sponsor_name: req.body.sponsor_name });
    if (!sponsor) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
      const newContract = new Contract({
      contract_id: contractID,
      contract_token: contractFile,
      contract_type: req.body.contract_type,
      contract_file_hash: contractFile,
      sponsor_id: sponsor._id,
      sponsor_name: req.body.sponsor_name,
      season_id: season._id,
      season_name:season.season_name,
      season_year:season.season_year,
      contract_start_date: season.season_start_date,
      contract_end_date: season.season_end_date,
      contract_with: req.body.contract_with,
      contract_with_emailId: req.body.contract_with_emailId,
      contract_with_contact_number: req.body.contract_with_contact_number,
      contract_from_emailId: req.body.contract_from_emailId,
      contract_from_contact_number: req.body.contract_from_contact_number,
      uploaded_by: req.body.uploaded_by,
      contract_status: req.body.contract_status,
      contract_comment: req.body.contract_comment,
      is_active: req.body.is_active,
      recordDate: req.body.recordDate,
    });

    const response = addContractDetails(contractID,newContract);
    if(response) {
    newContract.save()
    .then(savedContract=> {
      res.json(savedContract);
    })
    .catch(error => {
          res.status(500).json({ error: 'Error saving Team' });
    });
  }
      } else{
        res.status(500).json({ error: 'Something went wrong' });
    }

    // Fetch the vendor ID based on the vendor name
    if (req.body.contract_type == "Vendor"){
    const vendor = await Vendor.findOne({ vendor_name: req.body.vendor_name });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
      const newContract = new Contract({
      contract_id: contractID,
      contract_token: contractFile,
      contract_type: req.body.contract_type,
      contract_file_hash: contractFile,
      vendor_id: vendor._id,
      vendor_name: req.body.vendor_name,
      season_id: season._id,
      season_name:season.season_name,
      season_year:season.season_year,
      contract_start_date: season.season_start_date,
      contract_end_date: season.season_end_date,
      contract_with: req.body.contract_with,
      contract_with_emailId: req.body.contract_with_emailId,
      contract_with_contact_number: req.body.contract_with_contact_number,
      contract_from_emailId: req.body.contract_from_emailId,
      contract_from_contact_number: req.body.contract_from_contact_number,
      uploaded_by: req.body.uploaded_by,
      contract_status: req.body.contract_status,
      contract_comment: req.body.contract_comment,
      is_active: req.body.is_active,
      recordDate: req.body.recordDate,
    });

    const response = addContractDetails(contractID,newContract);
    if(response) {
    newContract.save()
    .then(savedContract=> {
      res.json(savedContract);
    })
    .catch(error => {
          res.status(500).json({ error: 'Error saving Team' });
    });
  }
      } else{
        res.status(500).json({ error: 'Something went wrong' });
    }
});






/*******************************************************************************/
/* **************Fetch  Player List****************************************/
/*******************************************************************************/


app.get('/getPlayersList',  async (req, res) => {

  Player.find({}, { player_name: 1 })
    .then(players => {
      const playersNames = players.map(player => player.player_name);
      res.json(playersNames);
    })
    .catch(error => {
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Error fetching players' });
    });
});



/*******************************************************************************/
/* **************Fetch Teams  List****************************************/
/*******************************************************************************/


app.get('/getTeamsList',  async (req, res) => {

  Team.find({}, { team_name: 1 })
    .then(teams => {
      const teamNames = teams.map(team => team.team_name);
      res.json(teamNames);
    })
    .catch(error => {
      console.error('Error fetching teams:', error);
      res.status(500).json({ error: 'Error fetching teams' });
    });
});










/*******************************************************************************/
/* **************Fetch Sponsor  List****************************************/
/*******************************************************************************/

app.get('/getSponsorsList',  async (req, res) => {

  Sponsor.find({}, { sponsor_name: 1 })
    .then(sponsor => {
      const sponsorNames = sponsor.map(sponsor => sponsor.sponsor_name);
      res.json(sponsorNames);
    })
    .catch(error => {
      console.error('Error fetching sponsor:', error);
      res.status(500).json({ error: 'Error fetching sponsor' });
    });
});



/*******************************************************************************/
/* **************Fetch Vendor  List****************************************/
/*******************************************************************************/

app.get('/getVendorsList',  async (req, res) => {

  Vendor.find({}, { vendor_name: 1 })
    .then(vendor => {
      const vendorName = vendor.map(vendor => vendor.vendor_name);
      res.json(vendorName);
    })
    .catch(error => {
      console.error('Error fetching vendor:', error);
      res.status(500).json({ error: 'Error fetching vendor' });
    });
});



/*******************************************************************************/
/* **************Register API with user,pmo,admin**********************************/
/*******************************************************************************/


app.post('/addusers', (req, res) => {
  //const newUser = new User(req.body);
  const newUser = new User({
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    email_id: req.body.email_id,
    contact_number:req.body.contact_number,
    password: req.body.password,
    full_name: req.body.full_name,
    role: req.body.role,
    access: req.body.access,
    is_user_active: req.body.is_user_active
});
  newUser.save()
    .then(savedUser => {
      res.json(savedUser);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving user' });
    });
});

/*******************************************************************************/
/* **************Add team API **************************************************/
/*******************************************************************************/


app.post('/addteam', (req, res) => {
  const newTeam = new Team({
    team_id: req.body.team_id,
    team_name: req.body.team_name,
    email_id: req.body.email_id,
    team_owner_name: req.body.team_owner_name,
    team_logo: req.body.team_logo,
    no_of_players: req.body.no_of_players,
    phone_number: req.body.phone_number,
    is_active: req.body.is_active
});

newTeam.save()
    .then(savedTeam => {
      res.json(savedTeam);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving team' });
    });
});


/*******************************************************************************/
/* **************Add Player API **************************************************/
/*******************************************************************************/


app.post('/addplayer', (req, res) => {
  const newPlayer = new Player({
    player_id: req.body.player_id,
    player_name: req.body.player_name,
    player_image: req.body.player_image,
    email_id: req.body.email_id,
    phone_number: req.body.phone_number,
    is_active: req.body.is_active
});

newPlayer.save()
    .then(savedPlayer => {
      res.json(savedPlayer);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving player' });
    });
});

/*******************************************************************************/
/* **************Add Vendor API **************************************************/
/*******************************************************************************/


app.post('/addvendor', (req, res) => {
  const newVendor = new Vendor({
    vendor_id: req.body.vendor_id,
    vendor_name: req.body.vendor_name,
    email_id: req.body.email_id,
    phone_number: req.body.phone_number,
    is_active: req.body.is_active
});

newVendor.save()
    .then(savedVendor => {
      res.json(savedVendor);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving Vendor' });
    });
});

/*******************************************************************************/
/* **************Add sponsor API **************************************************/
/*******************************************************************************/


app.post('/addsponsor', (req, res) => {
  const newSponsor = new Sponsor({
    sponsor_id: req.body.sponsor_id,
    sponsor_name: req.body.sponsor_name,
    email_id: req.body.email_id,
    phone_number: req.body.phone_number,
    is_active: req.body.is_active
});

newSponsor.save()
    .then(savedSponsor => {
      res.json(savedSponsor);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving sponsor' });
    });
});

/*******************************************************************************/
/* **************Add sponsor API **************************************************/
/*******************************************************************************/

app.post('/addseasons', (req, res) => {
  const newSeason = new Season({
    season_id: req.body.season_id,
    season_name: req.body.season_name,
    season_year: req.body.season_year,
    season_admin_email: req.body.season_admin_email,
    season_admin_contact_number: req.body.season_admin_contact_number,
    season_start_date: req.body.season_start_date,
    season_end_date: req.body.season_end_date,
    is_active: req.body.is_active,
    team_ids: req.body.team_ids,
    vendor_ids: req.body.vendor_ids,
    sponsor_ids: req.body.sponsor_ids
  });

  newSeason.save()
    .then(savedSeason => {
      res.json(savedSeason);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving season' });
    });  
});


/*******************************************************************************/
/* **************Login API with user,pmo,admin**********************************/
/*******************************************************************************/
app.post("/login", async (req, res) => {
  // const { username, password, role } = req.body;
  // const users = require("./users.json");
  // const user = users.find(
  //   (user) => user.username === username && user.password === password && user.role=== role
  // );

  const user = await User.findOne({ user_name: req.body.username, password: req.body.password, role: req.body.role });

  if (user) {
    res.json({
      message: "Login successful",
      fullname: user.full_name,
      username: user.user_name,
      role: user.role,
      access: user.access,
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});


/*******************************************************************************/
/* **************fetch all Contract from DB**********************************/
/*******************************************************************************/

app.get('/contractList', (req, res) => {
  Contract.find()
    .then(contracts => {
      res.json(contracts);
    })
    .catch(error => {
      console.error('Error fetching contracts:', error);
      res.status(500).json({ error: 'Error fetching contracts' });
    });
});


/*******************************************************************************/
/* **************Update Contract Status, actionBy, actionDate, comment**********************************/
/*******************************************************************************/



app.post("/updateContractStatus", (req, res) => {
 

  let current = new Date();
  const actionDate = current.toISOString().slice(0,10);

  collection.updateOne( 
    { "contractID": req.body.contractId },
      { $set: { "status":  req.body.status,"actionBy": req.body.actionBy,'actionDate':actionDate,'comment':req.body.comment } })
  .then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Contract Status updated successfully"  });
    } else {
      res.status(404).send('contract not found');
    }
  })
  .catch((error) => {
    console.error('Error updating record:', error);
    res.status(500).send('Internal Server Error');
  });
  const contractDetails = req.body;
  console.log("*********req.body",contractDetails);
  //approveStatus(actionDate,contractDetails);
 
  res.json({
    message: `Contract status updated successfully.`,
  });
});

/*******************************************************************************/
/* **************View File**********************************/
/*******************************************************************************/




// Define a route for fetching a file
app.get("/fetchContract/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  console.log("filePath : ", filePath);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf-8");
    res.json({ fileData });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});


/*******************************************************************************/
/* **************  Storing Data Set into The Blockchain**********************************/
/*******************************************************************************/



// async function addTeamContract(contractDetails) {
// console.log('$$$$$$$$$$');
//   try {
//     contractJson = JSON.stringify(contractDetails);
//     console.log(contractJson);
//     console.log(contractID);
//     // const contract = await blockchainUtils.createInstance('User2','teamcontractCC');
//     // const bufferResponse = await contract.submitTransaction('AddTeamContract',contractID.toString('utf-8'), contractJson);
//     console.log("bufferResponse*****************",bufferResponse);
//   } catch (error) {
//     console.log("error", error);
//   }
// }
// async function addPlayerContract(contractDetails) {
 

//   try {
//     contractJson = JSON.stringify(contractDetails);
//     // const contract = await blockchainUtils.createInstance('User2','playercontractCC');
//     // const bufferResponse = await contract.submitTransaction('AddPlayerContract',contractID.toString('utf-8'), contractJson);
//   } catch (error) {
//     console.log("error", error);
//   }
// }
// async function addSponserContract(contractDetails) {

//   try {
//     contractJson = JSON.stringify(contractDetails);
//     console.log(contractJson);
//     console.log(contractID);
//     // const contract = await blockchainUtils.createInstance('User2','sponsercontractCC');
//     // const bufferResponse = await contract.submitTransaction('AddSponserContract',contractID.toString('utf-8'), contractJson);
//   } catch (error) {
//     console.log("error", error);
//   }
// }
// async function addVendorContract(contractDetails) {

//   try {
//     contractJson = JSON.stringify(contractDetails);
//     console.log(contractJson);
//     console.log(contractID);
//     // const contract = await blockchainUtils.createInstance('User2','vendorcontractCC');
//     // const bufferResponse = await contract.submitTransaction('AddVendorContract',contractID.toString('utf-8'), contractJson);
//   } catch (error) {
//     console.log("error", error);
//   }
// }


/*******************************************************************************/
/* **************  Approve Status on Data Set into The Blockchain**********************************/
/*******************************************************************************/




// async function approveStatus(actionDate, contractDetails) {
//   console.log("contractStatus,contractId,actionBy,comment",contractDetails,actionDate);
//   if(contractDetails.contractType == "Team"){
//     try {
//       const contract = await blockchainUtils.createInstance('User2','teamcontractCC');
//       await contract.submitTransaction('ApproveTeamContract',contractDetails.contractId.toString('utf-8'),contractDetails.status.toString('utf-8'), contractDetails.actionBy.toString('utf-8'), actionDate.toString('utf-8'), contractDetails.comment.toString('utf-8'));
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
//   if(contractDetails.contractType == "Sponser"){
//     try {
//       const contract = await blockchainUtils.createInstance('User2','sponsercontractCC');
//       await contract.submitTransaction('ApproveSponserContract',contractDetails.contractId.toString('utf-8'),contractDetails.status.toString('utf-8'), contractDetails.actionBy.toString('utf-8'), actionDate.toString('utf-8'), contractDetails.comment.toString('utf-8'));
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
//   if(contractDetails.contractType == "Player"){
//     try {
//       const contract = await blockchainUtils.createInstance('User2','playercontractCC');
//       const txresult = await contract.submitTransaction('ApprovePlayerContract',contractDetails.contractId.toString('utf-8'),contractDetails.status.toString('utf-8'), contractDetails.actionBy.toString('utf-8'), actionDate.toString('utf-8'), contractDetails.comment.toString('utf-8'));
//     console.log(txresult)
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
//   if(contractDetails.contractType == "Vendor"){
//     try {
//       const contract = await blockchainUtils.createInstance('User2','vendorcontractCC');
//       await contract.submitTransaction('ApproveVendorContract',contractDetails.contractId.toString('utf-8'),contractDetails.status.toString('utf-8'), contractDetails.actionBy.toString('utf-8'), actionDate.toString('utf-8'), contractDetails.comment.toString('utf-8'));
//     } catch (error) {
//       console.log("error", error);
//     }
//   }
 
// }

// async function GetData(){
  
//   const teamcontract = await blockchainUtils.createInstance('User2','teamcontractCC');
//   const teamHlfResponse = await teamcontract.evaluateTransaction('GetAllContract');
//   //console.log("bufferResponse", teamHlfResponse);
//   var teamData = JSON.parse(teamHlfResponse);

//   //console.log("bufferResponse", teamData);
//   console.log("inside get data");
//   const playercontract = await blockchainUtils.createInstance('User2','playercontractCC');
//   const playerHlfResponse = await playercontract.evaluateTransaction('GetAllContract');
//   //console.log("bufferResponse", playerHlfResponse);
//   var playerData = JSON.parse(playerHlfResponse);
//   console.log(playerData);
//   const sponserContract = await blockchainUtils.createInstance('User2','sponsercontractCC');
//   const sponserHlfResponse = await sponserContract.evaluateTransaction('GetAllContract');
//   //console.log("bufferResponse", hlfResponse);
//   var sponserData = JSON.parse(sponserHlfResponse);

//   const vendorcontract = await blockchainUtils.createInstance('User2','vendorcontractCC');
//   const vendorHlfResponse = await vendorcontract.evaluateTransaction('GetAllContract');
//   //console.log("bufferResponse", hlfResponse);
//   var vendorData = JSON.parse(vendorHlfResponse);
 
// const data =  playerData.concat(teamData,sponserData,vendorData);	//console.log(jsonArray);
//  console.log("Keys", data)
//   return data;
// }





/*******************************************************************************/
/* **************  Post TeamPlayer List **********************************/
/*******************************************************************************/

// POST API to create a new player
app.post('/addTeamPlayerList', (req, res) => {
  const { teams_player_id, team_id, player_id, season_id, created_at, updated_at, deleted_at, is_active } = req.body;
  console.log("******",req.body);
  const teamsplayer = new TeamsPlayer({
    teams_player_id,
    team_id,
    player_id,
    season_id,
    created_at,
    updated_at,
    deleted_at,
    is_active
  });

  teamsplayer.save()
    .then((teamPlayerList) => {
      res.status(201).json({ message: 'teams-player created successfully' ,teamPlayerList:teamPlayerList});
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

/*******************************************************************************/
/* **************  GET API to find players based on teamId and seasonId **********************************/
/*******************************************************************************/


app.get('/getTeamplayersByTeamIdSeasonId/:teamId/:seasonId', (req, res) => {
  const { teamId, seasonId } = req.params;
  console.log("teamId and season",teamId, seasonId);
  TeamsPlayer.find({ team_id: teamId, season_id: seasonId })
    .then((players) => {
      console.log(players[0].player_id);
      Team.find({ _id: teamId })
      .then(team => {
      
      Player.find({ _id: { $in: players[0].player_id } })
    .then(players => {
      res.status(200).json({ message: 'team and Player details' ,players:players,Team:team});
    })
    .catch(error => {
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Error fetching players' });
    });

   // res.json(players);
  })
    //  res.status(200).json(players[0].player_id);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

/*******************************************************************************/
/* **************  GET API to find a player based on playerId **********************************/
/*******************************************************************************/

app.get('/getPlayerById/:playerId', (req, res) => {
  const { playerId } = req.params;
console.log("******",playerId);
  Player.findOne({ _id: playerId })
    .then((player) => {
      if (player) {
        res.status(200).json(player);
      } else {
        res.status(404).json({ message: 'Player not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.get('/getSeasonById/:seasonId', (req, res) => {
  const seasonId = req.params.seasonId;
  const userrole = 'admin';
  // Retrieve the season document by season ID
  Season.findById(seasonId)
    .then(season => {
      if (!season) {
        return res.status(404).json({ error: 'Season not found' });
      }
      
      User.findOne({ role: userrole })
        .then(user => {
          //res.json(user);
          Team.find({})
        .then(teams => {
          res.status(200).json({ message: 'team and admin details' ,user:user,Team:teams});
          //res.json(teams);
        })
        .catch(error => {
          console.error('Error fetching teams:', error);
          res.status(500).json({ error: 'Error fetching teams' });
        });
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          res.status(500).json({ error: 'Error fetching user' });
        });

      // Retrieve all teams associated with the season
      
    })
    .catch(error => {
      console.error('Error fetching season:', error);
      res.status(500).json({ error: 'Error fetching season' });
    });
});
// app.get('/getSeasonById/:seasonId', (req, res) => {
//   const { seasonId } = req.params;
// console.log("seasonId",seasonId);
//   Season.findOne({ _id: seasonId })
//     .then((season) => {
//       if (season) {

//         Season.findById(seasonId)
//         .then(season => {
         
    
//           // Retrieve all teams associated with the season
//           Team.find({})
//             .then(teams => {
//               res.json(teams);
//             })
//             .catch(error => {
//               console.error('Error fetching teams:', error);
//               res.status(500).json({ error: 'Error fetching teams' });
//             });
//         })
//         .catch(error => {
//           console.error('Error fetching season:', error);
//           res.status(500).json({ error: 'Error fetching season' });
//         });
        
//         res.status(200).json(season);
//       } else {
//         res.status(404).json({ message: 'Season not found' });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error.message });
//     });
// });


app.get("/getSeasonsList", async (req, res) => {
  Season.find({}, { season_name: 1, season_year: 1 })
    .then((season) => {
      //const seasonName = season.map((season) => season.season_name);
      //const seasonYear = season.map((season) => season.season_year);
      console.log(season)
      res.json({season});
    })
    .catch((error) => {
      console.error("Error fetching season:", error);
      res.status(500).json({ error: "Error fetching season" });
    });
});


app.delete('/deletecollections', async (req, res) => {
  try {
    // Delete all teams
    await Team.deleteMany({});

    // Delete all players
    await Player.deleteMany({});

    // Delete all sponsors
    await Sponsor.deleteMany({});

    // Delete all vendors
    await Vendor.deleteMany({});

    // Delete all contracts
    await Contract.deleteMany({});
    // delete all teamsPlayer
    await TeamsPlayer.deleteMany({});
     // delete all teamsPlayer
    await Season.deleteMany({});
    // Delete all User
    await User.deleteMany({});
    
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/searchcontracts", async (req, res) => {
  const { season,contract_status, created_by,  contract_with, startDate, endDate, page, limit } =
    req.query;
  const query = {};
  //console.log(req.query);

  // Add search criteria to the query object based on the provided parameters

  if (season) {
    const seasonobject = await Season.findOne({ season_year: season });
    if (!seasonobject) {
      return res.status(404).json({ error: "Season not found" });
    }
    query.season_id = seasonobject._id;
  }

  if (created_by) {
    query.uploaded_by = new RegExp(created_by, 'i');;
  }

  if (contract_status) {
    query.contract_status = new RegExp(contract_status, 'i'); 
  }

  if (contract_with) {
    query.contract_with = new RegExp(contract_with, 'i');;
  }

  if (startDate && endDate) {
    query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.created_at = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.created_at = { $lte: new Date(endDate) };
  }


  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  

  if (Object.keys(query).length === 0) {
    Contract.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .then((contracts) => {
        
        if (!contracts || contracts.length === 0) {
          return res.status(404).json({ message: "No contracts found" });
        }
    
    Contract.countDocuments()
       .then(totalCount => {

      res.json({ total_count: totalCount, contracts: contracts });
    })
    .catch(error => {
      console.error('Error counting documents:', error);
      res.status(500).json({ error: 'Error counting documents' });
    });

        //res.json(contracts);
      })
      .catch((error) => {
        console.error("Error fetching contracts:", error);
        res.status(500).json({ error: "Error fetching contracts" });
      });
  } else {
    // Perform the search with the provided criteria
    Contract.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .then((contracts) => {
        if (!contracts || contracts.length === 0) {
          return res.status(404).json({ message: "No contracts found" });
        }

        Contract.countDocuments(query)
       .then(totalCount => {
      // Your other code and response handling here
      res.json({ total_count: totalCount, contracts: contracts });
    })
    .catch(error => {
      console.error('Error counting documents:', error);
      res.status(500).json({ error: 'Error counting documents' });
    });

        //res.json(contracts);
      })
      .catch((error) => {
        console.error("Error searching contracts:", error);
        res.status(500).json({ error: "Error searching contracts" });
      });
  }
});


app.put('/updateContracts/:contract_id', async (req, res) => {
  const contract_id = req.params.contract_id;
  
  const { contract_type,contract_status, action_by, action_date, contract_comment } = req.body;

  // Create an update object with the fields to be updated
  const update = {};
  if (contract_status) {
    update.contract_status = contract_status;
  }
  if (action_by) {
    update.action_by = action_by;
  }
  if (action_date) {
    //update.action_date = action_date;
    update.updated_at = action_date;
  }
  if (contract_comment) {
    update.contract_comment = contract_comment;
  }

  // Update the contract document
  const findContract = await Contract.findOne({ contract_id: contract_id });
  console.log(findContract);
  
  const response = approveContract(contract_id,update,findContract.is_active,findContract.is_contract_fabricated);
  if(response){
  Contract.findByIdAndUpdate(contract_id, update, { new: true })
    .then(updatedContract => {
      if (!updatedContract) {
        return res.status(200).json({ message: 'No Contract found' });
      }

      res.json(updatedContract);
    })
    .catch(error => {
      console.error('Error updating contract:', error);
      res.status(500).json({ error: 'Error updating contract' });
    });
  }
});

async function addContractDetails(contractID,contractDetails) {
  console.log('$$$$$$$$$$');
  try {
   const contractJson = JSON.stringify(contractDetails);
    console.log(contractJson);
    console.log(contractID);
    const contract = await blockchainUtils.createInstance('User2','gclcontractCC');
    const bufferResponse = await contract.submitTransaction('addContract',contractID.toString('utf-8'), contractJson);
    console.log("bufferResponse*****************",bufferResponse);
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}


async function approveContract(contract_id, update,is_active,is_contract_fabricated) {
    console.log("contractStatus,contractId,actionBy,comment",update,actionDate);
    if(contractDetails.contractType == "Team"){
      try {
        const contract = await blockchainUtils.createInstance('User2','gclcontractCC');
        const bufferResponse = await contract.submitTransaction('approveContract',contract_id.toString('utf-8'),update.contract_status.toString('utf-8'), update.action_by.toString('utf-8'), update.updated_at.toString('utf-8'), update.contract_comment.toString('utf-8'),is_active,is_contract_fabricated);
        return true;
      } catch (error) {
        console.log("error", error);
      }
    }
  }


  app.get("/getAllContracts", async (req, res) => {
    try {
    const gclContract = await blockchainUtils.createInstance('User2','gclcontractCC');
    const gclhlfResponse = await gclContract.evaluateTransaction('getAllContracts',1,10);
    console.log(gclhlfResponse);
    res.json(gclhlfResponse);
    } catch { 
      res.status(500).json({ error: "Error fetching season" });
    };

  });
  
  app.get("/getContractByQuery", async (req, res) => {
    try {
    const gclContract = await blockchainUtils.createInstance('User2','gclcontractCC');
    const gclhlfResponse = await gclContract.evaluateTransaction('getContractByQuery',req.body.query.toString('utf-8'));
    console.log(gclhlfResponse);
    res.json(gclhlfResponse);
  } catch { 
    res.status(500).json({ error: "Error fetching season" });
  };
  });

  app.get("/getContractByContractID", async (req, res) => {
    try {
    const gclContract = await blockchainUtils.createInstance('User2','gclcontractCC');
    const gclhlfResponse = await gclContract.evaluateTransaction('getContractByContractID',req.body.contract_id.toString('utf-8'));
    console.log(gclhlfResponse);
    res.json(gclhlfResponse);
  } catch { 
    res.status(500).json({ error: "Error fetching season" });
  };
  });


  app.get("/getContractBySeasonID", async (req, res) => {
    try {
    const gclContract = await blockchainUtils.createInstance('User2','gclcontractCC');
    const gclhlfResponse = await gclContract.evaluateTransaction('getContractBySeasonID',req.body.season_id.toString('utf-8'));
    console.log(gclhlfResponse);
    res.json(gclhlfResponse);
  } catch { 
    res.status(500).json({ error: "Error fetching season" });
  };
  });
// app.delete('/deleteAllContractDetails', (req, res) => {
//   // Delete all records in the collection
//   collection
//     .deleteMany({})
//     .then((result) => {
//       res.status(200).send(`Deleted ${result.deletedCount} records`);
//     })
//     .catch((error) => {
//       console.error('Error deleting records:', error);
//       res.status(500).send('Internal Server Error');
//     });
// });
// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
