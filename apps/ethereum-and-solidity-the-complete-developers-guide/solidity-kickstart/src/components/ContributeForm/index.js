import * as React from 'react'
import { Form, Input, Button, Message, MessageHeader, FormField } from 'semantic-ui-react'
import web3 from '../../utils/web3'
import compiledCampaign from '../../../ethereum/build/Campaign.json'

const ContributeForm = (props) => {
  const [contributeValue, setContributeValue] = React.useState('')
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const handleFormSubmit = async () => {
    try {
      setError(null)
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      const campaign = new web3.eth.Contract(compiledCampaign.abi, props.campaignAddress)

      await campaign.methods.contribute().call({
        from: accounts[0],
        value: web3.utils.toWei(contributeValue, 'ether')
      })

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contributeValue, 'ether')
      })

      props.onSubmitFinish?.()
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={() => handleFormSubmit()}>
      <h5>Contribution to this campaign!</h5>

      <FormField>
        <Input
          value={contributeValue}
          type="number"
          label="ether"
          labelPosition="right"
          onInput={(e) => setContributeValue(e.target.value)}
        />
      </FormField>

      <div style={{ marginTop: '10px' }}>
        <Button
          type="submit"
          primary
          content="Contribute!"
          loading={loading}
        />
      </div>

      {
        error &&
        <Message negative>
          <MessageHeader>Something wrong. Please try again.</MessageHeader>
          <p style={{ wordBreak: 'break-all' }}>{error}</p>
        </Message>
      }
    </Form>
  )
}

export default ContributeForm
