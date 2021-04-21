import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

import axios from 'axios'

import './App.css'

const Main = () => (
  <Container fluid>
    <Row>
      <Col>Today's Report</Col>
    </Row>
  </Container>
)

type ReportData = {
  summary?: string
  reporter?: string
  field?: {
    fieldId?: string
    nutrient?: string
    percentage?: string
    feedback?: string
  }[]
}

function SideButton(props: { label: string; style?: Record<string, unknown> }) {
  const { label, style = {} } = props
  return (
    <Button
      block
      size="lg"
      style={{
        ...style, // passed styles
        padding: 10,
      }}
      variant="primary"
    >
      {label}
    </Button>
  )
}

function App() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [state, setState] = useState<ReportData>({})

  useEffect(() => {
    axios
      .get(`http://localhost:4200/reports`)
      .then((r) => {
        setLoading(false)
        setState(r?.data?.data as ReportData)

        return r?.data.data
      })
      .catch(console.error)
  }, [])

  useEffect(() => {}, [isLoading])

  if (isLoading) return <>Loading</>

  return (
    <div className="">
      <div className="sidenav">
        <SideButton label="Summary" />

        <SideButton label="Reports" />

        <SideButton label="Add Field" />

        <SideButton label="Show reports" />
      </div>

      <div className="main">
        <Main />
      </div>
    </div>
  )
}

export default App
