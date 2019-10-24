import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import { Container, Input, Button } from '@material-ui/core'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { domainUrl } from '../../variables'

const axios = require('axios')

const useStyles = makeStyles({
  container: {
    paddingTop: '10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'space-between'
  }
})

const Login = (props) => {
  // Creates state hooks for login and password
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)

  const [alert, setAlert] = React.useState({
    open: false,
    responseMessage: ''
  })

  const closeDialog = () => {
    setAlert({
      open: false,
      responseMessage: ''
    })
  }

  const submitHandler = (e) => {
    e.preventDefault() // Prevents reloading after form submission
    // Sends post request to api
    axios.post(`${domainUrl}/api/login`, {
      login: login,
      password: password
    })
      .then(function (response) {
        if (response.data.success) {
          props.callback(response.data.token, response.data.user)
        } else {
          setAlert({
            open: true,
            responseMessage: response.data.message
          })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const classes = useStyles()

  return (
    <>
      <Container className={classes.container}>
        <form onSubmit={submitHandler}>
          <Input
            fullWidth
            placeholder='Login'
            id='login'
            onChange={e => setLogin(e.target.value)}
            required
            inputProps={{ 'aria-label': 'login' }}
          />
          <Input
            fullWidth
            placeholder='Senha'
            type='password'
            id='password'
            onChange={e => setPassword(e.target.value)}
            required
            inputProps={{ 'aria-label': 'password' }}
          />
          <Button type='submit'> Entrar </Button>
        </form>
      </Container>
      <Dialog
        open={alert.open}
        onClose={closeDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {alert.responseMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color='primary'>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Login
