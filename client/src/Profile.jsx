import React, { useContext } from 'react'
import { Header, Icon, Table } from 'semantic-ui-react'
import HeaderBar from './HeaderBar';
// @ts-ignore
import styles from './App.module.css'
import { MyContext } from './MyContext'


const Profile = () => {
  const {user} = useContext(MyContext)
  const [userInfo, ] = user;

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={styles.grid_item_header}><HeaderBar /></header>
      <div>
        <Header as="h1">
          <Icon name="drivers license" />
          {' '}
          My Profile
          {' '}
        </Header>
        <Table>
          <thead>
            <tr>
              <th>Claim</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userInfo).map((claimEntry) => {
              const claimName = claimEntry[0]
              const claimValue = claimEntry[1]
              const claimId = `claim-${claimName}`
              return (
                <tr key={claimName}>
                  <td>{claimName}</td>
                  <td id={claimId}>{JSON.stringify(claimValue)}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Profile
