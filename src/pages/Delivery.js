import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { BrowserQRCodeReader } from '@zxing/library';
import Moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import Web3 from 'web3';

function addWallets(web3, seed) {
  let bip39 = require("bip39");
  let hdkey = require('ethereumjs-wallet/hdkey');
  let hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(seed));
  let wallet_hdpath = "m/44'/60'/0'/0/";

  for (let i = 0; i < 10; i++) {
      let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
      let privateKey = wallet.getPrivateKey().toString("hex");
      web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount("0x"+privateKey));
  }
}

let sendTransactionEx = null;

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io"));
addWallets(web3, process.env.REACT_APP_MNEMONIC);
web3MonkeyPatch(web3);

function web3MonkeyPatch(web) {
  const min = (a,b) => (a<b) ? a : b;
  sendTransactionEx = async function(tx) {
    if (typeof(web3.eth.accounts.wallet[tx["from"]])==="undefined") 
      return await web3.eth.sendTransaction(tx)
    else {
      let account = web3.eth.accounts.wallet[tx["from"]];
      let nonce = await web3.eth.getTransactionCount(account.address);
      
      if (typeof(tx["gas"])==="undefined") tx["gas"] = await web3.eth.estimateGas(tx);
      if (typeof(tx["gasPrice"])==="undefined") tx["gasPrice"] = min(web3.utils.toBN(await web3.eth.getGasPrice()), web3.utils.toBN('20000000000')).toString();
      let tx_signed = await web3.eth.accounts.signTransaction(tx, account.privateKey);
      return await web3.eth.sendSignedTransaction(tx_signed.rawTransaction)
    }
  }
}

const erc20Abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


const dividendAbi = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x06fdde03"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x095ea7b3"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x18160ddd"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x313ce567"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x39509351"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "utility",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x40b2f5b5"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x70a08231"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x95d89b41"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa457c2d7"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xdd62ed3e"
  },
  {
    "inputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "symbol",
        "type": "string"
      },
      {
        "name": "totalSupply",
        "type": "uint256"
      },
      {
        "name": "utility_",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "ReleaseDividendsRights",
    "type": "event",
    "signature": "0x36263ba6d12744d5cff511cccb3e7f307d324e2d8b8d80f32ee17946c9336e6b"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "AcceptDividends",
    "type": "event",
    "signature": "0xfd79186865d95a3bc46c677ebca9c859b628dde3530e0e057736a0299706062f"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event",
    "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event",
    "signature": "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "dividendsRightsOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x14074135"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "releaseDividendsRights",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xbf60e53b"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa9059cbb"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x23b872dd"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "acceptDividends",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xa30f9d2d"
  }
];

const cryptoYen = new web3.eth.Contract(erc20Abi, "0xd407E0ed18fcE18394330e7d0e2bC657892c9E33");
const asset0 = new web3.eth.Contract(dividendAbi, "0x7a6d914e93Bb282d6108Ce57f9129c71D1E8b0C8");

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  videoContainer: {
    height: '350px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: theme.spacing.unit * 2,
  },
  video: {
    alignSelf: 'center',
    flexShrink: 0,
    maxWidth: '100%',
    minHeight: '100%',
  },
  title: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    borderBottom: '1px solid silver',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  progress: {
    alignSelf: 'center',
    margin: theme.spacing.unit * 2,
  },
});

class Delivery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scannedItems: {
      },
      open: false,
    };

    this.videoElement = React.createRef();
    this.codeReader = new BrowserQRCodeReader();
  }

  componentDidMount() {
    this.scan();
  }

  componentWillUnmount() {
  }

  async scan() {
    this.codeReader.decodeFromInputVideoDevice(undefined, this.videoElement.current).then(result => {
      if (!this.state.scannedItems.hasOwnProperty(result.text)) {
        this.state.scannedItems[result.text] = { ts: Moment().valueOf() };
        this.setState({ scannedItems: this.state.scannedItems });
      }

      setTimeout(() => this.scan(), 200);
    }).catch(err => console.error(err));
  }

  async onSubmit() {
    this.setState({ loading: true, scannedItems: {} });

    var tokenReceipt = await sendTransactionEx({
      from: web3.eth.accounts.wallet[0].address, 
      to: cryptoYen.address,
      data: cryptoYen.methods.increaseAllowance(asset0.address, web3.utils.toWei("1")).encodeABI()
    });

    this.setState({ tokenReceiptHash: tokenReceipt.transactionHash });

    var assetReceipt = await sendTransactionEx({
      from: web3.eth.accounts.wallet[0].address, 
      to: asset0.address,
      data: asset0.methods.acceptDividends(web3.eth.accounts.wallet[0].address, web3.utils.toWei("1")).encodeABI()
    });

    this.setState({ loading: false, assetReceiptHash: assetReceipt.transactionHash, open: true });
  }

  onOK() {
    this.setState({ open: false });
  }
  
  render () {
    const { loading } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          Destination: Scan QR
        </Typography>
        <div className={classes.videoContainer}>
          <video className={classes.video} ref={this.videoElement}></video>
        </div>
        <Typography variant="h6">
          Scanned items
        </Typography>
        <List>{Object.entries(this.state.scannedItems).map((item) =>
          <ListItem key={item[0]}>
            <ListItemText
              primary={item[0]}
              secondary={Moment(item[1].ts).format("lll")}
            />
          </ListItem>
        )}</List>
        <Button disabled={loading} size="large" variant="contained" color="secondary" className={classes.button} onClick={this.onSubmit.bind(this)}>
          Submit and Pay <PlaylistAddCheckIcon className={classes.rightIcon} />
        </Button>
        {loading && <CircularProgress size={56} color="secondary" className={classes.progress} />}
        <Dialog
          open={this.state.open}
          onClose={this.onOK.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Done</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have successfully completed transaction
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onOK.bind(this)} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <br/>
        {this.state.tokenReceiptHash && <Typography>
          Funds allocated: <a target="_blank" href={"https://rinkeby.etherscan.io/tx/" + this.state.tokenReceiptHash}>{this.state.tokenReceiptHash}</a>
        </Typography>}
        {this.state.assetReceiptHash && <Typography>
          Transfer complete: <a target="_blank" href={"https://rinkeby.etherscan.io/tx/" + this.state.assetReceiptHash}>{this.state.assetReceiptHash}</a>
        </Typography>}
      </div>
    )
  }
}

Delivery.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Delivery);