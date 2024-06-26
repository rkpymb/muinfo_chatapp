import { Inter } from "next/font/google";
import "./globals.css";
import styles from "@/app/page.module.css";

const inter = Inter({ subsets: ["latin"] });
import AsideTop from "./Components/CommanComp/AsideTop";
import CreateGroup from "./Components/CommanComp/CreateGroup";
import GroupLists from "./Components/CommanComp/GroupLists";
import MyGroups from "./Components/CommanComp/MyGroups";
import AutoLogin from "./Components/CommanComp/AutoLogin";

import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import BackDropLoader from '../app/Components/CommanComp/BackDropLoader'
import { darkTheme, lightTheme } from '@/app/themes/themes';

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import CheckloginStates from '../../context/auth/CheckloginStates'

export const metadata = {
  title: "Community Groups",
  description: "by magadhuniversityinfo.com",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className={inter.className}>

        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <CheckloginStates >
            <BackDropLoader />
            <div className={styles.Fullbg}>
              <div className={styles.Container}>
                <div className={styles.ChatSection}>
                  {isBrowser &&
                    <div className={styles.ChatSectionA}>
                      <AutoLogin />
                      <AsideTop />
                      <MyGroups />
                    </div>

                  }
                  

                  <div className={styles.ChatSectionB}>
                    {children}
                    <div className={styles.FooterDevider}></div>
                  </div>
                </div>
              </div>
            </div>
          </CheckloginStates >

        </ThemeProvider>

      </body>
    </html>
  );
}
