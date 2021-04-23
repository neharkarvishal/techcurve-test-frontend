import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import DataGrid, { TextEditor } from 'react-data-grid'

import axios from 'axios'

import './App.css'

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

const columnsData = [
  { key: 'fieldId', name: 'Field ID', editor: TextEditor },
  { key: 'nutrient', name: 'Nutrient', editor: TextEditor },
  { key: 'percentage', name: 'Percentage', editor: TextEditor },
  { key: 'feedback', name: 'Feedback', editor: TextEditor },
]

const rowsData = [
  { fieldId: 0, nutrient: 'nutrient1', percentage: '0', feedback: '-' },
  { fieldId: 1, nutrient: 'nutrient2', percentage: '0', feedback: '-' },
]

const ReportForm = (props: {
  reportData: ReportData
  updateReport: React.Dispatch<React.SetStateAction<ReportData>>
  rows: any
  columns: any
  onRowsChange: any
}) => {
  const { reportData = {}, updateReport, columns, rows, onRowsChange } = props
  const { summary, reporter, field = [] } = reportData

  return (
    <Container fluid>
      <Row>
        <Col>Today's Report</Col>
      </Row>

      <br />

      <Col>
        <Form>
          {summary && (
            <Form.Group as={Row} controlId="formGroupSummary">
              <Form.Label>Summary</Form.Label>

              <Col sm="6">
                <Form.Control
                  onChange={(e) => {
                    updateReport({ ...reportData, summary: e.target.value })
                  }}
                  placeholder="Summary"
                  type="text"
                  value={reportData.summary ?? ''}
                />
              </Col>
            </Form.Group>
          )}

          {reporter && (
            <Form.Group as={Row} controlId="formGroupReporter">
              <Form.Label>Reporter</Form.Label>

              <Col sm="6">
                <Form.Control
                  onChange={(e) => {
                    updateReport({ ...reportData, reporter: e.target.value })
                  }}
                  placeholder="Reporter"
                  type="text"
                  value={reportData.reporter ?? ''}
                />
              </Col>
            </Form.Group>
          )}

          {!!field.length &&
            field.map((f, index) => (
              <DataGrid
                columns={columns}
                // eslint-disable-next-line react/no-array-index-key
                key={`field${index}`}
                onRowsChange={onRowsChange}
                rows={rows}
              />
            ))}
        </Form>
      </Col>
    </Container>
  )
}

const ReportTable = (props: {
  reportData: ReportData
  updateReport: React.Dispatch<React.SetStateAction<ReportData>>
  rows: any
  columns: any
  onRowsChange: any
}) => {
  const { reportData = {}, updateReport, columns, rows, onRowsChange } = props

  const { summary, reporter, field = [] } = reportData

  return (
    <Container fluid>
      <Row>
        <Col>Today's Report</Col>
      </Row>
      {!!field.length &&
        field.map((report, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`field${index}`}>
            <DataGrid columns={columns} onRowsChange={onRowsChange} rows={rows} />
          </div>
        ))}

      <br />
    </Container>
  )
}

function SideButton(props: {
  label: string
  style?: Record<string, unknown>
  onClick: () => void
}) {
  const { label, style = {}, onClick } = props
  return (
    <Button
      block
      onClick={onClick}
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
  const [showReports, setReportsVisibility] = useState<boolean>(false)
  const [reportData, updateReport] = useState<ReportData>({})
  const [rows, setRows] = useState(rowsData)

  const addFields = () => {
    const newState = { ...reportData }
    newState?.field?.push({
      fieldId: '',
      percentage: '',
      nutrient: '',
    })
    updateReport(newState)
  }

  useEffect(() => {
    axios
      .get(`http://localhost:4200/reports`)
      .then((r) => {
        setLoading(false)
        updateReport(r?.data?.data as ReportData)

        return r?.data.data
      })
      .catch(console.error)
  }, [])

  useEffect(() => {}, [isLoading])

  if (isLoading) return <>Loading</>

  return (
    <div className="">
      <div className="sidenav">
        <SideButton
          key="Summary-button"
          label="Summary"
          onClick={() => {
            updateReport({ ...reportData, summary: 'Summary' })
          }}
        />

        <SideButton
          key="Reports-button"
          label="Reports"
          onClick={() => {
            updateReport({ ...reportData, reporter: 'Reporter' })
          }}
        />
        <SideButton
          key="Add-Field-Button"
          label="Add Field"
          onClick={() => addFields()}
        />

        <SideButton
          key="Show-reports-button"
          label="Show reports"
          onClick={() => {
            setReportsVisibility(!showReports)
          }}
        />
      </div>

      <div className="main">
        {showReports ? (
          <ReportTable
            columns={columnsData}
            onRowsChange={setRows}
            reportData={reportData}
            rows={rows}
            updateReport={updateReport}
          />
        ) : (
          <ReportForm
            columns={columnsData}
            onRowsChange={setRows}
            reportData={reportData}
            rows={rows}
            updateReport={updateReport}
          />
        )}
      </div>
    </div>
  )
}

export default App
