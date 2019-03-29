import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LabelIcon from '@material-ui/icons/Label';
import CameraIcon from '@material-ui/icons/Camera';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
  button: {
    margin: theme.spacing.unit,
    maxWidth: 400,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

const Home = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Button size="large" variant="contained" className={classes.button} component={Link} to="/account">
        Account <AccountBalanceWalletIcon className={classes.rightIcon} />
      </Button>
      <Button size="large" variant="contained" className={classes.button} component={Link} to="/label">
        Label <LabelIcon className={classes.rightIcon} />
      </Button>
      <Button size="large" variant="contained" className={classes.button} component={Link} to="/scan">
        Scan <CameraIcon className={classes.rightIcon} />
      </Button>
      <Button size="large" variant="contained" className={classes.button} component={Link} to="/delivery">
        Delivery <ReceiptIcon className={classes.rightIcon} />
      </Button>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
