export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Download
} from "lucide-react";
import { getDashboardStats, getGraphRevenue, getRecentSales } from "@/features/analytics/actions";
import { DashboardStatsSkeleton } from "@/components/skeletons/dashboard-stats-skeleton";
import { RevenueChart } from "@/features/analytics/components/revenue-chart";
import { RecentSales } from "@/features/analytics/components/recent-sales";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Link href="/analytics/export">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

async function AnalyticsContent() {
    const stats = await getDashboardStats();
    const graphData = await getGraphRevenue();
    const recentSales = await getRecentSales();

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
                        <EuroIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Orders</h3>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.orderCount}</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Products</h3>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.productCount}</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Active Members</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{stats.memberCount}</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col gap-1">
                        <h3 className="font-semibold leading-none tracking-tight">Overview</h3>
                        <p className="text-sm text-muted-foreground">Monthly revenue breakdown.</p>
                    </div>
                    <div className="p-6 pt-0 pl-2">
                        <RevenueChart data={graphData} />
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col gap-1">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Sales</h3>
                        <p className="text-sm text-muted-foreground">You made {stats.orderCount} sales this month.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <RecentSales sales={recentSales} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function EuroIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10h12" />
        <path d="M4 14h9" />
        <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
      </svg>
    )
}
