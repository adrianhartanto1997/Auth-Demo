import type { Metadata } from 'next'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import PageWrapper from '@/components/pages/default_page'
import { adminService } from '@/services'
import { verifyProtectedWebRoute } from '@/lib/token'
import UserListTable from './user_list'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const getStatisticData = async (userID: number) => {
  const [data, _err] = await adminService.getStatistic(userID)
  return data
}

const getUserListData = async (userID: number) => {
  const [data, _err] = await adminService.getUsersView(userID)
  return data
}

export default async function Page() {
  const headerList = headers()
  const cookieStore = cookies()

  const userID = await verifyProtectedWebRoute(cookieStore, headerList)
  if (!userID) {
    redirect('/')
  }

  const statistic = await getStatisticData(userID)
  const userList = await getUserListData(userID)

  return (
    <PageWrapper>
      <div className="title mb-4">Dashboard</div>

      <div className="mb-5">
        <div className="tile-container">
          <div className="tile-item">
            <div className="caption">Total Users</div>
            <div className="figure">{statistic?.usersCount}</div>
          </div>
          <div className="tile-item">
            <div className="caption">Total Users with active session today</div>
            <div className="figure">{statistic?.todayActiveSessionCount}</div>
          </div>
          <div className="tile-item">
            <div className="caption">
              Average of active session users
              <br />
              (last 7 days)
            </div>
            <div className="figure">{statistic?.last7DaysActiveSessionAvg}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="sub-title mb-2">Users</div>
        <div className="table-container">
          <UserListTable data={JSON.stringify(userList)}/>
        </div>
      </div>
    </PageWrapper>
  )
}
