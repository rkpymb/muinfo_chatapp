"use client"
import { ConsoleView } from 'react-device-detect';
import CheckloginContext from './CheckloginContext'
import { useState, useEffect } from 'react'


const CheckloginStates = (props) => {

  const [UserData, setUserData] = useState({});
  const [UserLogin, setUserLogin] = useState(false);
  const [MainLoader, setMainLoader] = useState(true);
  const [NotificationCount, setNotificationCount] = useState(0);
  const [AppMode, setAppMode] = useState(false);
  const [UserJwtToken, setUserJwtToken] = useState(null);



  const [AlertData, setAlertData] = useState({
    AlertStatus: false,
    TextMsg: 'This is Test alert for you !',
    severity: 'warning',
  });



  useEffect(() => {

    checkAppMode()
    CheckUserLogin()

  }, []);


  const ChangeMainLoader = async (e) => {
    setMainLoader(e)
  }
  const ChangeAppMode = async (e) => {
    setAppMode(e)
    console.log(`AppMode : ${e}`)
  }
  const ChangeUserData = async (e) => {
    setUserData(e)

  }
  const ChangeUserLogin = async (e) => {
    setUserLogin(e)

  }
  const ChangeUserJwtToken = async (e) => {
    console.log(e)
    setUserJwtToken(e)

  }


  const checkAppMode = () => {
    const storedAppMode = localStorage.getItem('appMode');
    if (storedAppMode) {
      setAppMode(true)

    } else {

      setAppMode(false)
    }
  };
  const CheckUserLogin = async () => {
    console.log('Checking Login')

    try {
      const sendUM = {}
      const data = await fetch("/api/user/check_auth", {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(sendUM)
      }).then((a) => {
        return a.json();
      })
        .then((parsedFinal) => {
         
          if (parsedFinal.ReqData) {
        
            setUserData(parsedFinal.ReqData.UserData || parsedFinal.ReqData)
            setUserJwtToken(parsedFinal.jwt_token)
           
            setUserLogin(true)
            CheckNotifications()
          
          } else {
            setUserLogin(false)

          }

        })

    } catch (error) {
      setUserLogin(false)


    }
  }

  const CheckNotifications = async () => {
    try {
      const sendUM = {}
      const data = await fetch("/api/user/user_pending_notifications", {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(sendUM)
      }).then((a) => {
        return a.json();
      })
        .then((parsedFinal) => {

          if (parsedFinal.ReqData) {

            setNotificationCount(parsedFinal.ReqData.allnoti || 0)

          }

        })

    } catch (error) {
      console.log(error)

    }
  }


  const ChangeAlertData = async (Msg, severity) => {
    const AD = {
      AlertStatus: true,
      TextMsg: Msg,
      severity: severity,
    }
    setAlertData(AD)

  }


  const LogoutUser = async () => {
    const confirmLogout = confirm('Do you really want to log out?');
    if (confirmLogout) {
      // Send a request to the server-side route to log out the user
      try {
        const response = await fetch('/api/user/user_logout', {
          method: 'POST',
          credentials: 'include', // Include cookies in the request
        });


        if (response.ok) {
          // // Clear local storage
          removeCookie('jwt_token')
          localStorage.clear();
          setUserData(null)
          setUserJwtToken(null)
          setUserLogin(false)

          window.location.reload();
        } else {
          window.location.reload();
          // Handle error
          console.error('Error logging out:', response.msg);

        }
      } catch (error) {
        console.log((error))
        console.error('Error logging out:', error);
        window.location.reload();

      }
    }
  };


  const removeCookie = (name, path = '/') => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;

  };



  return (
    <CheckloginContext.Provider value={{ UserJwtToken, UserData, UserLogin, ChangeUserLogin, ChangeUserData, ChangeAlertData, AlertData, ChangeMainLoader, MainLoader, ChangeAppMode, AppMode, LogoutUser, NotificationCount, CheckNotifications,ChangeUserJwtToken ,CheckUserLogin}}>
      {props.children}
    </CheckloginContext.Provider>
  )

}
export default CheckloginStates;