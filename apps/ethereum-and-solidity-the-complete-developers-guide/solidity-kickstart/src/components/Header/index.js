'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, MenuMenu, MenuItem } from 'semantic-ui-react'

const Header = () => {
  const router = useRouter(

  )
  return (
    <Menu>
      <Link href="/" className="item">
        CrowdCoin
      </Link>

      <MenuMenu position='right'>
        <Link href="/" className="item">
          Campaigns
        </Link>

        <Link href="/campaigns/new" className="item">
          +
        </Link>
      </MenuMenu>
    </Menu>
  )
}

export default Header
