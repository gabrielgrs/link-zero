import { getDashboardData } from '@/actions/shared'
import { DashboardClient } from './client'

export default async function Page() {
  const [data, err] = await getDashboardData()
  if (err) throw err

  return <DashboardClient sales={data.allSales} />
}
