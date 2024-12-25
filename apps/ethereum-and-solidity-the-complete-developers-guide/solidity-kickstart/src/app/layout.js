
import * as React from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import Header from '../components/Header'
import styles from './layout.module.scss'

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Container>
          <div className={styles['header-wrapper']}>
            <Header />
          </div>
          
          {children}
        </Container>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Croudcampaign',
}

export default RootLayout
