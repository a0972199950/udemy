'use client'
import * as React from 'react'
import { Form, FormField, Input, Button, Message, MessageHeader } from 'semantic-ui-react'
import compiledCampaign from '../../../../../../ethereum/build/Campaign.json'
import web3 from '../../../../../utils/web3'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NewCampaignRequestPage = ({ params }) => {
  const router = useRouter()

  const [description, setDescription] = React.useState('')
  const [value, setValue] = React.useState('')
  const [recipient, setRecipient] = React.useState('')

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const handleFormSubmit = async () => {
    try {
      setError(null)
      setLoading(true)
      const accounts = await web3.eth.getAccounts()
      const campaign = new web3.eth.Contract(compiledCampaign.abi, params.campaignAddress)

      // 先用 .call() 檢查以下參數是否合法。此方法不會與 Metamask 交互，並且在錯誤時可以獲得 solidity 的 require() 內寫的 error message
      await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).call({
        from: accounts[0]
      })

      await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
        from: accounts[0]
      })

      router.push(`/campaigns/${params.campaignAddress}/requests`)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Link
        href={`/campaigns/${params.campaignAddress}/requests`}
        style={{ marginTop: '10px', display: 'inline-block' }}
      >
        Back
      </Link>

      <h3>Create a Request</h3>

      <Form onSubmit={() => handleFormSubmit()}>
        <FormField>
          <label>Description</label>
          <Input
            value={description}
            type="text"
            onInput={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <FormField>
          <label>Amount in Ether</label>
          <Input
            value={value}
            type="number"
            onInput={(e) => setValue(e.target.value)}
          />
        </FormField>

        <FormField>
          <label>Recipient</label>
          <Input
            value={recipient}
            type="text"
            onInput={(e) => setRecipient(e.target.value)}
          />
        </FormField>

        <Button
          primary
          type="submit"
          loading={loading}
          content="Create"
        />

        {
          error &&
          <Message negative>
            <MessageHeader>Something wrong. Please try again.</MessageHeader>
            <p style={{ wordBreak: 'break-all' }}>{JSON.stringify(error, (_key, value) => typeof value === 'bigint' ? value.toString() : value )}</p>
          </Message>
        }
      </Form>
    </>
  )
}

export default NewCampaignRequestPage
