'use client';

import { useState, useEffect } from 'react';
import { searchProfiles } from '@/services/api';
import type { Profile } from '@/services/types';

export default function Home() {
  const [username, setUsername] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [topProfiles, setTopProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取邀请码最多的10个用户
  useEffect(() => {
    const fetchTopProfiles = async () => {
      try {
        const response = await searchProfiles('');
        // 按照邀请数量从大到小排序，如果邀请数量相同，则按照 score 从大到小排序
        const sorted = response.data.values
          .sort((a, b) => {
            if (b.invitesAvailable === a.invitesAvailable) {
              return b.actor.score - a.actor.score;
            }
            return b.invitesAvailable - a.invitesAvailable;
          })
          .slice(0, 10);
        setTopProfiles(sorted);
      } catch (err) {
        console.error('Failed to fetch top profiles:', err);
      }
    };

    fetchTopProfiles();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchProfiles(username);
      setProfiles(response.data.values);
    } catch (err) {
      setError('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Ethos 用户查询
        </h1>

        {/* 邀请码排行榜 */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <h2 className="text-xl font-bold text-gray-900">邀请码排行榜 - Top 10</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 border border-gray-200">
                    排名
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    用户
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    用户名
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    可用邀请数量
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {topProfiles.map((profile, index) => (
                  <tr key={profile.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                      <span className="text-sm font-medium text-gray-900">{profile.actor.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                      <span className="text-sm text-gray-500">@{profile.actor.username}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right border border-gray-200">
                      <span className="text-sm font-semibold text-blue-600">{profile.invitesAvailable}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right border border-gray-200">
                      <span className="text-sm text-gray-500">{profile.actor.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 搜索区域 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">用户搜索</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入用户名搜索..."
                  className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow duration-200 shadow-sm hover:shadow-md"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                {loading ? '搜索中...' : '搜索'}
              </button>
              <div className="text-gray-500 text-sm">
                {profiles.length === 0 && !loading && (
                  <span>{username ? '未找到匹配的用户' : '请输入用户名开始搜索'}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl border border-red-200 shadow-sm">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* 搜索结果 */}
        {profiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <h2 className="text-xl font-bold text-gray-900">搜索结果</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      用户
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      用户名
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      可用邀请数量
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      Score
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      地址
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <span className="text-sm font-medium text-gray-900">{profile.actor.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-200">
                        <span className="text-sm text-gray-500">@{profile.actor.username}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right border border-gray-200">
                        <span className="text-sm font-semibold text-blue-600">{profile.invitesAvailable}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right border border-gray-200">
                        <span className="text-sm text-gray-500">{profile.actor.score}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right border border-gray-200">
                        <span className="text-sm text-gray-500">{profile.actor.primaryAddress.slice(0, 6)}...{profile.actor.primaryAddress.slice(-4)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
} 