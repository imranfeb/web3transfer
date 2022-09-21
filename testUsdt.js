//This module help to listen request
var express = require("express");
var router = express.Router();
var axios = require("axios");
const Web3 = require("web3");

const web3 = new Web3("https://bsc-dataseed1.binance.org/");
const Common = require('ethereumjs-common');

const Tx = require('ethereumjs-tx').Transaction;
const InputDataDecoder = require('ethereum-input-data-decoder');






// web3.setProvider(
//     new web3.providers.HttpProvider(
//        // "https://rinkeby.infura.io/t2utzUdkSyp5DgSxasQX"
//        "https://speedy-nodes-nyc.moralis.io/d67ea2c319957b719814f79a/eth/rinkeby"
//     )
// );



var abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const decoder = new InputDataDecoder(abi)



var contractAddress = "0x42D47bAE0Bc0cd3DeB9313830dFb702568ddC408";






 

//-------------------------------------------------------------- Send Tokens ---------------------------------------------------------------------

router.post("/transfer", async function (request, response) {
var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	
	try {
		if(request.body) {
			var ValidationCheck = true;
			if (!request.body.from_address) {
				ResponseMessage = "from_address is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.to_address) {
				ResponseMessage += "to_address is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.from_private_key) {
				ResponseMessage += "from_private_key  is missing \n";
				ValidationCheck = false;
			}
			if (!request.body.value) {
				ResponseMessage += "value is missing \n";
				ValidationCheck = false;
			} else if (!request.body.value === parseInt(request.body.value)) {
				ResponseMessage += "value must be a number \n";
				ValidationCheck = false;
			}
			
			if(ValidationCheck == true) {
				let fromAddress = request.body.from_address;
				let privateKey = request.body.from_private_key;
				let toAddress = request.body.to_address;
				let tokenValue = request.body.value;


				if (fromAddress.length < 42) {
					ResponseMessage = "Invalid From Address";
					ResponseCode = 400;
					return;
				} else if (toAddress.length < 42) {
					ResponseMessage = "Invalid To Address";
					ResponseCode = 400;
					return;
				}
    

   const customChainParams = { name: 'bnb', chainId: 56, networkId: 56 }
    const common = Common.default.forCustomChain('mainnet', customChainParams, 'petersburg');
    
    
    
    
               web3.eth.defaultAccount = fromAddress;
				
				tokenValue = tokenValue;

				let contract = new web3.eth.Contract( abi , contractAddress , {
                    from: fromAddress
                });
				//let count = web3.eth.getTransactionCount(web3.eth.defaultAccount);
			let count = await web3.eth.getTransactionCount(fromAddress , 'latest');
				let data = contract.methods.transfer(toAddress, tokenValue).encodeABI();
				
				let gasPrice = web3.eth.gasPrice ;
				let gasLimit =  200000;
				//let gasLimit = web3.utils.toHex(6721975) ;
                var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open( "GET", "https://bscscan.com/api?module=account&action=tokenbalance&contractaddress=" +
					contractAddress +
					"&address=" +
					fromAddress +
					"&tag=latest&apikey=YourApiKeyToken", false ); // false for synchronous request
				xmlHttp.send();
				var transactions = JSON.parse(xmlHttp.responseText);
				let balance = transactions.result;




				
			   
			











				//let balance = 1000000000000000000000000000000;
				console.log(balance);
				if(balance >= tokenValue + gasLimit) {
					let rawTransaction = {
						"from": fromAddress,
						"nonce": web3.utils.toHex(count),
						"gasPrice": web3.utils.toHex(200000000000),
						"gasLimit": web3.utils.toHex(gasLimit),
						
						"to": contractAddress,
						
						"data": data,
						
					};

					privateKey = Buffer.from(privateKey, 'hex');
					const tx = new Tx(rawTransaction, { common });
					console.log("ye hai tx", tx);

					tx.sign(privateKey);
					let serializedTx = tx.serialize();
					let hashObj = await sendrawtransaction(serializedTx);
					console.log( hashObj);
				
					if (hashObj.response == '') {
						let hash = hashObj.hash;
						ResponseData = await getTransaction(hash);
						ResponseMessage = "Transaction successfully completed";
						ResponseCode = 200;
					} else {
						ResponseMessage = hashObj.response;
						ResponseCode = 400;
						return;
					}
				} else {
					ResponseMessage = "Balance is insufficent";
					ResponseCode = 400;
					return;
				}
				
			} else {
				ResponseCode = 206
			}
		} else {
			ResponseMessage = "Transaction cannot proceeds as request body is empty";
			ResponseCode = 204
		}
		
	} catch (error) {
		ResponseMessage = `Transaction signing stops with the error  ${error}`;
		ResponseCode = 400
	} finally {
		return response.status(200).json({
			code : ResponseCode,
			data : ResponseData,
			msg : ResponseMessage
		});
	}
});

// ===============================================================================================================================================

// router.get("/getBalance/:walletAddress", (req, response) => {
// 	var ResponseCode = 200;
// 	var ResponseMessage = ``;
// 	var ResponseData = null;
// 	try {
// 		if(req.params) {
// 			if (!req.params.walletAddress) {
// 				ResponseMessage = "wallet address is missing \n";
// 				ResponseCode = 206;
// 			} else {
// 				let walletAddress = req.params.walletAddress;
// 				var date = new Date();
// 				var timestamp = date.getTime();
//                 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// 				var xmlHttp = new XMLHttpRequest();
// 				xmlHttp.open( "GET",  "https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" +
// 					contractAddress +
// 					"&address=" +
// 					walletAddress +
// 					"&tag=latest&apikey=YourApiKeyToken", false ); // false for synchronous request
// 				xmlHttp.send();
// 				var transactions = JSON.parse(xmlHttp.responseText);
// 				let balance = transactions.result;
// 				//balance = balance / 10 ** 6;
// 				balance = balance;
// 				ResponseData = {
// 					wallet: {
// 						balance: balance
// 					},
// 					message: "",
// 					timestamp: timestamp,
// 					status: 200,
// 					success: true
// 				};
// 				ResponseMessage = "Completed";
// 				ResponseCode = 200;
// 			}
// 		} else {
// 				ResponseMessage = "Transaction cannot proceeds as request params is empty";
// 				ResponseCode = 204;
// 		}
// 	} catch (error) {
// 		ResponseMessage = `Transaction signing stops with the error ${error}`;
// 		ResponseCode = 400;
// 	} finally {
// 		return response.status(200).json({
// 			code : ResponseCode,
// 			data : ResponseData,
// 			msg : ResponseMessage
// 		});
// 	}
    
// });
// // ===========================================================================================================================================================

// router.get("/track/:walletAddress", async function(req, response) {
// 	var ResponseCode = 200;
// 	var ResponseMessage = ``;
// 	var ResponseData = null;
// 	try {
// 		if(req.params) {
// 			if (!req.params.walletAddress) {
// 				ResponseMessage = "hash / wallet address is missing \n";
// 				ResponseCode = 206;
// 			} else {
// 				let hash = req.params.walletAddress;
				
// 				if (hash.length == 66) {
// 					ResponseData = await getTransaction(hash);
// 					ResponseMessage = "Completed";
// 					ResponseCode = 200;

// 				} else if (hash.length == 42) {
// 					var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// 					var xmlHttp = new XMLHttpRequest();
// 					xmlHttp.open( "GET", "http://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=" + hash + "&startblock=0&endblock=99999999&sort=asc&limit=100", false ); // false for synchronous request
// 					xmlHttp.send();
// 					var transactions = JSON.parse(xmlHttp.responseText);
// 					let _data = [];
// 					for (let i = 0; i < transactions.result.length; i++) {
// 						if (String(transactions.result[i].contractAddress).toUpperCase().localeCompare(String(contractAddress).toUpperCase()) == 0) {
// 							transactions.result[i].value = transactions.result[i].value ;
// 							_data.push(transactions.result[i]);
// 						}
// 						//99993988790  99993988791
// 						//6011100  6011099
// 					}
// 					ResponseData = {
// 						transaction: _data
// 					};
// 					ResponseMessage = "Completed";
// 					ResponseCode = 200;
// 				} else {
// 					ResponseMessage = "Invalid Hash or Wallet Address"
// 					ResponseCode = 400;
// 				}
// 			}
// 		} else {
// 			ResponseMessage = "Transaction cannot proceeds as request params is empty";
// 			ResponseCode = 204;
// 		}
// 	} catch (error) {
// 		ResponseMessage = `Transaction signing stops with the error ${error}`;
// 		ResponseCode = 400;
// 	} finally {
// 		return response.status(200).json({
// 			code : ResponseCode,
// 			data : ResponseData,
// 			msg : ResponseMessage
// 		});
// 	}
// });




function getTransaction(hash) {
	var data;
	return new Promise(function(resolve, reject) {
		web3.eth.getTransaction(hash, function (err, transaction) {
			var date = new Date();
			var timestamp = date.getTime();
			let inputdecode = decoder.decodeData(transaction.input);
			console.log(inputdecode);
			data = {
				transaction: {
					hash: transaction.hash,
					from: transaction.from,
					to: transaction.toAddress,
					amount: parseInt(inputdecode.inputs[1]) ,
					//amount: parseInt(inputdecode.inputs[1]) / 10 ** 6,
					currency: "LCT",
					fee: transaction.gasPrice,
					n_confirmation: transaction.transactionIndex,
					link: `https://bscscan.com/tx/${hash}`
				},
				message: "",
				timestamp: timestamp,
				status: 200,
				success: true
			};
			resolve(data);
		})
	});
}

function sendrawtransaction(serializedTx) {
	var hash;
	var response = "";
	return new Promise(function(resolve, reject) {
		web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"), function ( err, hsh ) {
			if (err) {
				response = `send Bad Request ${err}`;
			} else {
				hash = hsh;
			} 
			var obj = {
				response:  response,
				hash: hash
			};
			resolve(obj);
		});
	});
}

module.exports = router;