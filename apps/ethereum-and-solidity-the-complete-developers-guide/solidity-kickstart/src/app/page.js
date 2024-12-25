'use client'
import * as React from 'react'
import Link from 'next/link'
import { Card, Button } from 'semantic-ui-react'
import web3 from '../utils/web3'
import compiledCampaignFactory from '../../ethereum/build/CampaignFactory.json'
import compiledCampaign from '../../ethereum/build/Campaign.json'
import factoryAddress from '../../address'

const HomePage = () => {
  const [campaignAddresses, setCampaignAddresses] = React.useState([])
  React.useEffect(() => {
    const fetchData = async () => {
      const campaignFactory = await new web3.eth.Contract(
        compiledCampaignFactory.abi,
        factoryAddress
      )

      const campaignAddresses = await campaignFactory.methods.getDeployedCampaigns().call()

      setCampaignAddresses(campaignAddresses)
    }

    fetchData()
  }, [])

  const [campaignData, setCampaignData] = React.useState([])
  React.useEffect(() => {
    const generateCampaignsData = async () => {
      const campaignData = await Promise.all(campaignAddresses.map(async (campaignAddress) => {
        return {
          header: campaignAddress,
          description: <Link href={`/campaigns/${campaignAddress}`}>View Campaign</Link>,
          fluid: true
        }
      }))

      setCampaignData(campaignData)
    }

    generateCampaignsData()
  }, [campaignAddresses])


  return (
    <>
      <h3>Open campaigns</h3>

      <Link href="/campaigns/new">
        <Button
          content="Create Campaign"
          icon="add circle"
          primary
          floated="right"
        />
      </Link>

      {
        !!campaignData.length &&
        <Card.Group items={campaignData} />
      }
    </>
  )
}

export default HomePage
