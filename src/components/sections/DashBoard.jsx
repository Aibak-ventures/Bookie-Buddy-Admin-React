import React from 'react'
import { refreshToken } from '../../api/AxiosConfig'
// import AppSidebar from '../layout/AppSidebar'

function DashBoard() {
  return (
    <div>
      my DashBoard 
      <button  className="bg-amber-700" onClick={refreshToken}>to refresh</button>
    </div>
  )
}

export default DashBoard