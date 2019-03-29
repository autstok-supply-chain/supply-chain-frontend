import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { QRCode } from "react-qr-svg";
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
    borderBottom: '1px solid silver',
  },
  subtitle: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
  },
  heading: {
    fontWeight: 'bold',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  qrContainer: {
    marginTop: `${theme.spacing.unit * 2}px`,
    alignSelf: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  qrCodeBackground: {
    margin: `${theme.spacing.unit * 2}px`,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '2px 2px 10px rgba(0,0,0,0.5)',
  },
  qrCode: {
    margin: `${theme.spacing.unit * 3}px`,
    height: 256,
    width: 256,
  }
});

class Account extends Component {
  constructor(props) {
    super(props);

    console.log(props);

    this.state = {
      expanded: null
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    console.log("Unmounting...");
  }

  componentDidUpdate(prevProps) {
    if (this.props.account !== prevProps.account) {
      this.loadData(this.props.account);
    }

    if (this.props.priorityQueueContract !== prevProps.priorityQueueContract) {
      this.loadPriorityQueue();
    }
  }

  handleExpand = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  shortAddress(address) {
    if (address)
      return `${address.substr(0, 6)}...${address.substr(36, 22)}`;
    else
      return '';
  }
  
  render () {
    const { web3Context } = this.props;
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          Account
        </Typography>
        <div>
          <Typography variant="h6">
            Address: {this.shortAddress(web3Context.publicAddress)}
          </Typography>
          <Typography variant="h6">
            Balance: {0}&nbsp;ETH
          </Typography>
          <div className={classes.qrContainer}>
            <div className={classes.qrCodeBackground}>
              <QRCode
                className={classes.qrCode}
                bgColor="#FFFFFF"
                fgColor={web3Context.publicAddress ? "#000000" : "#FFFFFF"}
                level="Q"
                value={web3Context.publicAddress || ''}
                />
            </div>
          </div>
        </div>
        <Typography variant="h6" className={classes.subtitle}>
          Export
        </Typography>
        <ExpansionPanel expanded={expanded === 'exportPkString'} onChange={this.handleExpand('exportPkString')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Private Key String</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>Never share this to untrusted party</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Account)