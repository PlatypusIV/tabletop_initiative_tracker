import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import InitiativeList from './components/InitiativeList/InitiativeList'
import ControlBox from './components/ControlBox/ControlBox'

export default function App(): JSX.Element {

  return (
    <div className='app'>
        <Header />
        <div className='content'><InitiativeList /> <ControlBox /></div>
        <Footer />
    </div>
  )
}