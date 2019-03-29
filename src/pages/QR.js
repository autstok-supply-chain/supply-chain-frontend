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
});

class QR extends Component {
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
    this.scan()
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

  onSubmit() {
    this.setState({ scannedItems: {}, open: true });
  }

  onOK() {
    this.setState({ open: false });
  }
  
  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          Intermediate: Scan QR
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
        <Button size="large" variant="contained" color="primary" className={classes.button} onClick={this.onSubmit.bind(this)}>
          Submit <PlaylistAddCheckIcon className={classes.rightIcon} />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.onOK.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Done</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You have successfully confirmed items transit
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onOK.bind(this)} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

QR.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(QR);