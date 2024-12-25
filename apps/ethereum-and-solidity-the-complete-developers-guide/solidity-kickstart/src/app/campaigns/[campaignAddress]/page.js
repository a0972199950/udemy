'use client'
import * as React from 'react'
import { Grid, GridColumn, Button, GridRow, Card } from 'semantic-ui-react'
import Link from 'next/link'
import web3 from '../../../utils/web3'
import compiledCampaign from '../../../../ethereum/build/Campaign.json'
import ContributeForm from '../../../components/ContributeForm'

const CampaignPage = ({ params }) => {
  const [campaignSummary, setCampaignSummary] = React.useState(null)
  React.useEffect(() => {
    const fetchData = async () => {
      const campaign = new web3.eth.Contract(compiledCampaign.abi, params.campaignAddress)
      const summary = await campaign.methods.getSummary().call()
      setCampaignSummary(summary)
    }

    fetchData()
  }, [params.campaignAddress])

  const [campaignCardItems, setCampaignCardItems] = React.useState([])
  React.useEffect(() => {
    if (!campaignSummary) {
      return
    }

    setCampaignCardItems([
      {
        header: campaignSummary.manager,
        meta: 'Address of Manager',
        description: 'This manager created this campaign and can create requests to withdraw money',
        style: {
          overflowWrap: 'break-word'
        }
      },
      {
        header: web3.utils.fromWei(campaignSummary.minimumContribution, 'ether').toString(),
        meta: 'Minimum Contribution (ether)',
        description: 'You must contribute at least this much ether to become a approver'
      },
      {
        header: Number(campaignSummary.requestLength),
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. Requests most be approved be approvers'
      },
      {
        header: Number(campaignSummary.approversCount),
        meta: 'Number of Approvers',
        description: 'Number of people whe have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(campaignSummary.balance, 'ether').toString(),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend'
      },
    ])
  }, [campaignSummary])

  const handleSubmitFinish = async () => {
    try {
      const campaign = new web3.eth.Contract(compiledCampaign.abi, params.campaignAddress)
      const summary = await campaign.methods.getSummary().call()
      setCampaignSummary(summary)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h3>Cmapaign Details</h3>

      <Grid>
        <GridRow>
          <GridColumn width={10}>
            {
              !!campaignCardItems.length && <Card.Group items={campaignCardItems} />
            }
          </GridColumn>

          <GridColumn width={6}>
            <ContributeForm
              ampaignAddress={params.campaignAddress}
              onSubmitFinish={() => handleSubmitFinish()}
            />
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn>
            <Link href={`/campaigns/${params.campaignAddress}/requests`}>
              <Button
                primary
                content="View Requests"
              />
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>
    </>
  )
}

export default CampaignPage
