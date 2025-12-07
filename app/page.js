'use client';

import { useEffect, useState } from 'react';
import Layout from '../Layout';
import QuickLinks from '../Components/dashboard/QuickLinks';
import RecentBlocksTable from '../Components/dashboard/RecentBlocksTable';
import MempoolViz from '../Components/x1/MempoolViz';
import X1Rpc from '../Components/x1/X1RpcService';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard data
        const data = await X1Rpc.getDashboardData();
        setDashboardData(data);

        // Fetch recent blocks
        const blocks = await X1Rpc.getRecentBlocks(10);
        setRecentBlocks(blocks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Layout currentPageName="Dashboard">
        <div className="min-h-screen bg-[#0d1525] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading X1 Network Data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="Dashboard">
      <div className="min-h-screen bg-[#0d1525] text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#1d2d3a]">
          <div className="max-w-[1800px] mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-xl">X1</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">X1.space</h1>
                <p className="text-gray-500 text-xs">Blockchain Explorer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1800px] mx-auto px-4 py-6">
          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              label="Current Slot"
              value={dashboardData?.slot?.toLocaleString() || '0'}
              icon="📊"
              color="cyan"
            />
            <StatCard
              label="TPS"
              value={dashboardData?.tps?.toLocaleString() || '0'}
              icon="⚡"
              color="yellow"
            />
            <StatCard
              label="Validators"
              value={`${dashboardData?.validators?.current || 0} / ${dashboardData?.validators?.delinquent || 0}`}
              subLabel="Active / Delinquent"
              icon="🔷"
              color="blue"
            />
            <StatCard
              label="Total Transactions"
              value={dashboardData?.transactionCount?.toLocaleString() || '0'}
              icon="💸"
              color="purple"
            />
          </div>

          {/* Epoch Info */}
          {dashboardData && (
            <div className="bg-[#24384a] rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-gray-400 text-sm mb-4">EPOCH {dashboardData.epoch}</h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                      style={{ width: `${dashboardData.epochProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-white font-bold">{dashboardData.epochProgress}%</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{dashboardData.slotsRemaining?.toLocaleString()} slots remaining</span>
                <span>~{Math.floor(dashboardData.timeRemaining / 60)} minutes</span>
              </div>
            </div>
          )}

          {/* Mempool Visualization */}
          {recentBlocks.length > 0 && (
            <div className="bg-[#24384a] rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-gray-400 text-sm mb-4">RECENT BLOCKS</h3>
              <MempoolViz
                mempoolInterval="blocks"
                recentBlocks={recentBlocks}
                aggregatedBlocks={[]}
                dashboardSlot={dashboardData?.slot}
                showPending={true}
                pendingCount={20}
              />
            </div>
          )}

          {/* Recent Blocks Table */}
          <RecentBlocksTable blocks={recentBlocks} />

          {/* Quick Links */}
          <QuickLinks />
        </main>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, subLabel, icon, color }) {
  const colorClasses = {
    cyan: 'from-cyan-400/20 to-cyan-600/10 border-cyan-500/30',
    yellow: 'from-yellow-400/20 to-yellow-600/10 border-yellow-500/30',
    blue: 'from-blue-400/20 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-400/20 to-purple-600/10 border-purple-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subLabel && <p className="text-gray-500 text-xs mt-1">{subLabel}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
