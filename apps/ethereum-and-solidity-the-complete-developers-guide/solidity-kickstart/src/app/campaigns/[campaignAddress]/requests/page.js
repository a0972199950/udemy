'use client'
import * as React from 'react'
import { Button, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Grid, GridColumn, GridRow, FormField, Label } from 'semantic-ui-react'
import Link from 'next/link'
import web3 from '../../../../utils/web3'
import CompiledCampaign from '../../../../../ethereum/build/Campaign.json'

const CampaignRequestsPage = ({ params }) => {
  const [approversCount, setApproversCount] = React.useState('')
  const [campaign, setCampaign] = React.useState(null)
  const [requests, setRequests] = React.useState([])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const campaign = new web3.eth.Contract(CompiledCampaign.abi, params.campaignAddress)

        const approversCount = await campaign.methods.approversCount().call()
        const requestCount = await campaign.methods.getRequestCount().call()
        const requests = await Promise.all(
          Array.from({ length: Number(requestCount) }).map((_, i) => (
            campaign.methods.requests(i).call()
          ))
        )

        setApproversCount(Number(approversCount))
        setCampaign(campaign)
        setRequests(requests)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [params.campaignAddress])

  const [loading, setLoading] = React.useState(null)
  const [error, setError] = React.useState(null)

  const handleApprove = async (index) => {
    try {
      setError(false)
      setLoading({ index, type: 'APPROVE' })

      const accounts = await web3.eth.getAccounts()

      await campaign.methods.approveRequest(index, true).call({
        from: accounts[0]
      })

      await campaign.methods.approveRequest(index, true).send({
        from: accounts[0]
      })
      const newRequest = await updateRequest(index)
      setRequests(requests.map((origin, i) => i === index ? newRequest : origin))
    } catch (err) {
      console.error(err)
      setError({ index, type: 'APPROVE', content: err.message })
    } finally {
      setLoading(null)
    }
  }

  const handleFinalize = async (index) => {
    try {
      setError(false)
      setLoading({ index, type: 'FINALIZE' })

      const accounts = await web3.eth.getAccounts()

      await campaign.methods.finalizeRequest(index).call({
        from: accounts[0]
      })

      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0]
      })
      const newRequest = await updateRequest(index)
      setRequests(requests.map((origin, i) => i === index ? newRequest : origin))
    } catch (err) {
      console.error(err)
      setError({ index, type: 'FINALIZE', content: err.message })
    } finally {
      setLoading(null)
    }
  }

  const updateRequest = (index) => {
    return campaign.methods.requests(index).call()
  }

  return (
    <>
      <Link
        href={`/campaigns/${params.campaignAddress}`}
        style={{ marginTop: '10px', display: 'inline-block' }}
      >
        Back
      </Link>

      <h3>Requests</h3>

      <Grid>
        <GridRow>
          <GridColumn floated="right" width="6">
            <Link href={`/campaigns/${params.campaignAddress}/requests/new`}>
              <Button primary floated="right">
                Add Request
              </Button>
            </Link>
          </GridColumn>
        </GridRow>

        <GridRow>
          <Table celled>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Amount (ether)</TableHeaderCell>
                <TableHeaderCell>Recipient</TableHeaderCell>
                <TableHeaderCell>Approval Count</TableHeaderCell>
                <TableHeaderCell>Approve</TableHeaderCell>
                <TableHeaderCell>Finalize</TableHeaderCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {
                requests.map((request, index) => (
                  <TableRow
                    key={index}
                    positive={!request.isCompleted && Number(request.approvals) / approversCount > 0.5}
                    disabled={request.isCompleted}
                  >
                    <TableCell>{index}</TableCell>
                    <TableCell>{request.description}</TableCell>
                    <TableCell>{web3.utils.fromWei(request.value, 'ether')}</TableCell>
                    <TableCell>{request.recipient}</TableCell>
                    <TableCell>{Number(request.approvals)}/{approversCount}</TableCell>

                    <TableCell>
                      {
                        !request.isCompleted &&
                        <FormField>
                          <Button
                            color="green"
                            basic
                            loading={loading && loading.index === index && loading.type === 'APPROVE'}
                            disabled={!!loading}
                            onClick={() => handleApprove(index)}
                          >
                            Approve
                          </Button>

                          {
                            error && error.index === index && error.type === 'APPROVE' &&
                            <Label
                              basic
                              color="red"
                              pointing
                            >
                              {error.content}
                            </Label>
                          }
                        </FormField>
                      }
                    </TableCell>

                    <TableCell>
                      {
                        !request.isCompleted && Number(request.approvals) / approversCount > 0.5 &&
                        <FormField>
                          <Button
                            color="teal"
                            basic
                            loading={loading && loading.index === index && loading.type === 'FINALIZE'}
                            disabled={!!loading}
                            onClick={() => handleFinalize(index)}
                          >
                            Finalize
                          </Button>

                          {
                            error && error.index === index && error.type === 'FINALIZE' &&
                            <Label
                              basic
                              color="red"
                              pointing
                            >
                              {error.content}
                            </Label>
                          }
                        </FormField>
                      }
                    </TableCell>
                  </TableRow>
                ))
              }
              
            </TableBody>
          </Table>
        </GridRow>
      </Grid>
      
      
      

      
    </>
  )
}

export default CampaignRequestsPage
