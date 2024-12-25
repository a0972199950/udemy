'use client'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormField, Button, Input, Message, MessageHeader } from 'semantic-ui-react'
import web3 from '../../../utils/web3'
import compiledCampaignFactory from '../../../../ethereum/build/CampaignFactory.json'
import address from '../../../../address'

const NewCampaignPage = () => {
  const router = useRouter()

  const [minimunContribution, setMinimunContribution] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleCreateCampaign = async () => {
    try {
      setLoading(true)
      setError('')
      const accounts = await web3.eth.getAccounts()
      const campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi, address)

      await campaignFactory.methods.createCampaign(web3.utils.toWei(minimunContribution, 'ether')).send({
        from: accounts[0],
      })

      router.push('/')
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h3>Create a campaign</h3>

      <Form onSubmit={() => handleCreateCampaign()}>
        <FormField>
          <label>Minimum Contribution (ether)</label>
          <Input
            type="number"
            label="ether"
            labelPosition="right"
            value={minimunContribution}
            onInput={e => setMinimunContribution(e.target.value)}
          />
        </FormField>

        {
          error &&
          <Message negative>
            <MessageHeader>Something wrong. Please try again.</MessageHeader>
            <p>{JSON.stringify(error)}</p>
          </Message>
        }

        <Button
          type='submit'
          primary
          loading={loading}
        >
          Create!
        </Button>
      </Form>
    </>
  )
}

export default NewCampaignPage
