import * as React from 'react'

// import Navbar from './Navbar'

export interface LayoutProps {
  className?: string
  useNavbar?: boolean
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ className, useNavbar, children }) => {
  return (
    <div className="animate-fade-in">
    {/*****************************
        Hide nav if not needed
        {useNavbar ? (<Navbar />) : (<></>)}
      ******************************/}
    
    <div className={`layout ${className}`}>
      <div className="pt-5">{children}</div>
    </div>
  </div>
  )
}