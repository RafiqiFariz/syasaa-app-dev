import { useEffect, useState } from "react"
import { SideBar } from "../../components/sidebar"
import { UserLayout } from "../../public/Layout/Layout"
import { useHistory } from "react-router"

export const DashboardPage = () => {
    const history = useHistory()
    console.log('Dashboard')
    return(
        <UserLayout>
            <div>
                Dashboard
            </div>
        </UserLayout>
    )
}