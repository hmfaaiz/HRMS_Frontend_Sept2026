import React, { useRef, useEffect, useState } from "react"
import { shallowEqual, useSelector, connect, useDispatch } from "react-redux"
import { LayoutSplashScreen } from "../../../../_metronic/layout"
import * as auth from "./authRedux"
import { getUserByToken } from "./authCrud"

function AuthInit(props) {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  // const { authToken } = useSelector(
  //   ({ auth }) => ({
  //     authToken: auth.authToken,
  //   }),
  //   shallowEqual
  // )
  const user = useSelector(({ auth }) => auth, shallowEqual)
  //console.log("Authinit", user)

  //const user = useSelector(({ auth }) => auth, shallowEqual)

  useEffect(() => {
    return () => {}
  }, [user])
  // const authToken = user.tokens
  // console.log("Authinit User", authToken)
  // We should request user by authToken before rendering the application
  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false)
    }, 2000)
    // const requestUser = async () => {
    //   try {
    //     if (!didRequest.current) {
    //       const { data: user } = await getUserByToken()
    //       dispatch(props.fulfillUser(user))
    //     }
    //   } catch (error) {
    //     console.error(error)
    //     if (!didRequest.current) {
    //       dispatch(props.logout())
    //     }
    //   } finally {
    //     setShowSplashScreen(false)
    //   }
    //   return () => (didRequest.current = true)
    // }
    // if (authToken) {
    //   requestUser()
    // } else {
    //   dispatch(props.fulfillUser(undefined))
    //   setShowSplashScreen(false)
    // }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connect(null, auth.actions)(AuthInit)
