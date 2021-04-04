import React from 'react'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'
import LoginScreen from './LoginScreen'
import { Row, Col } from 'react-bootstrap'

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.userLogin)
  return (
    <Row className='my-4'>
      <Col md={6} className='my-5'>
        <h1>Welcome to MERN BOOK</h1>
        <p>
          A minimalistic socila media platform to share moments and connect with
          friends.
        </p>
      </Col>
      <Col md={6}>
        {!userInfo && (
          <Route
            render={({ location, history }) => (
              <LoginScreen history={history} location={location} />
            )}
          />
        )}
      </Col>
    </Row>
  )
}

export default HomeScreen
