import React, { Component } from 'react'
import {
  Router,
  Route,
  Link
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

// Icons
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LabelIcon from '@material-ui/icons/Label';
import HomeIcon from '@material-ui/icons/Home';
import CameraIcon from '@material-ui/icons/Camera';

// Pages
import Home from '../pages/Home';
import Account from '../pages/Account';
import Label from '../pages/Label';
import QR from '../pages/QR';
import Delivery from '../pages/Delivery';

import Web3 from 'web3';
import Wallet from 'ethereumjs-wallet';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit,
    minWidth: 0,
  },
  toolbar: theme.mixins.toolbar,
});

const history = createBrowserHistory();

let web3Context = {
  web3js: null,
  wallet: null,
  privateKey: null,
  publicAddress: null,
}

class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    }
  }

  toggleMenu = (open) => () => {
    this.setState({
      menuOpen: open,
    });
  };

  async initWallet() {
    let pkString = localStorage.getItem('pk');
    let walletV3String = localStorage.getItem('wallet');

    web3Context.web3js = new Web3(Web3.givenProvider);
    
    if (pkString) {
      web3Context.privateKey = pkString;
      let acc = web3Context.web3js.eth.accounts.wallet.add(web3Context.privateKey);
      web3Context.publicAddress = acc.address;
    } else if (walletV3String) {
      let password = prompt('Account password');
      try {
        web3Context.wallet = Wallet.fromV3(JSON.parse(walletV3String), password);
        web3Context.privateKey = web3Context.wallet.getPrivateKeyString();
        web3Context.publicAddress = web3Context.wallet.getAddressString();
      }
      catch (err) {
        console.log("Error decoding wallet");
      }
    } else {
      web3Context.wallet = Wallet.generate();
      web3Context.privateKey = web3Context.wallet.getPrivateKeyString();
      web3Context.publicAddress = web3Context.wallet.getAddressString();
      
      let password = prompt('Set password');

      if (password.length > 0) {
        let walletV3 = JSON.stringify(web3Context.wallet.toV3(password));
        localStorage.setItem('wallet', walletV3);
      } else {
        localStorage.setItem('pk', web3Context.privateKey);
      }
    }

    this.setState({ publicAddress: web3Context.publicAddress })
  }

  componentDidMount() {
    setTimeout(() => this.initWallet(), 1);
  }

  render() {
    const { classes } = this.props;
    return (
      <div >
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleMenu(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              BANKEX Supply Chain
            </Typography>
          </Toolbar>
        </AppBar>
        <Router history={history}>
          <div className={classes.root}>
            <Drawer
              open={this.state.menuOpen}
              variant="temporary" classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.toggleMenu(false)}>
              <AppBar position="static">
                <Toolbar>
                  <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleMenu(false)}>
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <List>
                <ListItem button component={Link} to="/" onClick={this.toggleMenu(false)}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <Divider />
                <ListItem button component={Link} to="/account" onClick={this.toggleMenu(false)}>
                  <ListItemIcon>
                    <AccountBalanceWalletIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItem>
                <ListItem button component={Link} to="/label" onClick={this.toggleMenu(false)}>
                  <ListItemIcon>
                    <LabelIcon />
                  </ListItemIcon>
                  <ListItemText primary="Label" />
                </ListItem>
                <ListItem button component={Link} to="/scan" onClick={this.toggleMenu(false)}>
                  <ListItemIcon>
                    <CameraIcon />
                  </ListItemIcon>
                  <ListItemText primary="Scan" />
                </ListItem>
                <ListItem button component={Link} to="/delivery" onClick={this.toggleMenu(false)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delivery" />
                </ListItem>
              </List>
            </Drawer>
            <main className={classes.content}>
              <Route exact path="/" component={Home}/>
              <Route path="/account" render={(props) => <Account web3Context={web3Context} />} />
              <Route path="/label" component={Label}/>
              <Route path="/scan" component={QR}/>
              <Route path="/delivery" component={Delivery}/>
            </main>
          </div>
        </Router>
      </div>
    )
  }
}

Routes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Routes);