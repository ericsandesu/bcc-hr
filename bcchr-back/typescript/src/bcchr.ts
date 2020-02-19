import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'first-network', 'connection-org1.json');

// expressモジュールを読み込む
const express = require('express');
const cors = require('cors');


// expressアプリを生成する
const app = express();
app.use(cors());

/*
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain);
*/

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', async (req, res) => {
  var hasil = await main();
  console.log('hasil ' + hasil);
  res.send(hasil)
});

app.get('/attendances', async (req, res) => {
  var hasil = await mainAttendance();
  console.log('hasil ' + hasil);
  res.send(hasil)
});

app.get('/punchin', async function(req, res) {
  // リクエストボディを出力
  console.log('req.query.attendanceNumber ' + req.query.attendanceNumber  );
//  console.log('req.body ' + req.body + req.body.attendanceNumber );
  // パラメータ名、nameを出力
//  console.log(req.body.attendanceNumber);
//  console.log(req.body.punchIn);
//var dateFormat = require('dateformat');

var now = new Date();
//console.log(dateFormat(now, 'HH:MM:ss'));

// var timeInMss = Date.now();
  punchIn('ATTENDANCE'+req.query.attendanceNumber, now.getHours().toString()+':'+now.getMinutes().toString()+':'+now.getSeconds().toString());
  res.send('POST request to the homepage');
})

app.get('/punchout', async function(req, res) {
  // リクエストボディを出力
  console.log(req.body);
  // パラメータ名、nameを出力
  console.log('punch out');
  var now = new Date();
  //console.log(dateFormat(now, 'HH:MM:ss'));
  
    punchOut('ATTENDANCE'+req.query.attendanceNumber, now.getHours().toString()+':'+now.getMinutes().toString()+':'+now.getSeconds().toString());
  
  res.send('POST request to the homepage');
})


// ポート3000でサーバを立てる
app.listen(3100, () =>
  console.log('Listening on port 3100'));

async function main() {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.ts application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('bcchr');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryAllCars');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    //        return 'hello world';
    return result;
    //        return `Transaction has been evaluated, result is: ${result.toString()}`;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

async function mainAttendance() {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.ts application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('bcchr');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryAllAttendances');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    //        return 'hello world';
    return result;
    //        return `Transaction has been evaluated, result is: ${result.toString()}`;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

async function punchIn(attendanceNumber: string, punchIn: string) {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.ts application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('bcchr');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.submitTransaction('createAttendance', attendanceNumber, punchIn, '');
//    await contract.submitTransaction('createAttendance', 'ATTENDANCE3', '10:23', '14:53');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    //        return 'hello world';
    return result;
    //        return `Transaction has been evaluated, result is: ${result.toString()}`;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

async function punchOut(attendanceNumber: string, punchOut: string) {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.ts application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('bcchr');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.submitTransaction('punchOut', attendanceNumber, punchOut);
//    await contract.submitTransaction('createAttendance', 'ATTENDANCE3', '10:23', '14:53');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    //        return 'hello world';
    return result;
    //        return `Transaction has been evaluated, result is: ${result.toString()}`;
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}
