import React, { Component } from 'react'
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { QRCode } from "react-qr-svg";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

const uuidv4 = require('uuid/v4');

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    alignSelf: 'center',
    maxWidth: 700,
    maxHeight: 300,
    width: '100%',
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

class Label extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCodes: [],
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  
  onSubmit() {
    var qrCodes = [];

    for (var i = 0; i < 12; i++) {
      qrCodes.push(uuidv4());
    }

    this.setState({ qrCodes: qrCodes })
  }

  render () {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          QR Code Labels
        </Typography>
        <Button size="large" variant="contained" className={classes.button} onClick={this.onSubmit.bind(this)}>
          Create <PlaylistAddCheckIcon className={classes.rightIcon} />
        </Button>
        <div className={classes.qrContainer}>
          {this.state.qrCodes.map(id => (
            <div className={classes.qrCodeBackground}>
              <QRCode
                key={id}
                className={classes.qrCode}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                value={id}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Label.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Label);