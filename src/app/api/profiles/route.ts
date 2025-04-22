import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Profile } from '@/services/types';

export async function GET(request: Request) {
  try {
    // 获取 URL 中的搜索参数
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '';

    // 读取 JSON 文件
    const jsonDirectory = path.join(process.cwd(), 'public');
    const fileContents = await fs.readFile(jsonDirectory + '/profiles.json', 'utf8');
    const allProfiles: Profile[] = JSON.parse(fileContents);

    // 首先过滤掉无效的数据结构
    const profiles = allProfiles.filter(profile => 
      profile && 
      profile.actor && 
      profile.actor.username && 
      profile.actor.name &&
      typeof profile.actor.username === 'string' &&
      typeof profile.actor.name === 'string' &&
      typeof profile.invitesAvailable === 'number'
    );

    // 如果有搜索词，则过滤数据
    let filteredProfiles = profiles;
    if (username) {
      filteredProfiles = profiles.filter(profile => {
        const searchTerm = username.toLowerCase();
        return profile.actor.username.toLowerCase().includes(searchTerm) ||
               profile.actor.name.toLowerCase().includes(searchTerm);
      });
    }

    // 按照 invitesAvailable 从大到小排序
    filteredProfiles.sort((a, b) => b.invitesAvailable - a.invitesAvailable);

    // 如果是空搜索，则只返回前10个结果
    if (!username) {
      filteredProfiles = filteredProfiles.slice(0, 10);
    }

    return NextResponse.json({
      data: {
        values: filteredProfiles
      }
    });
  } catch (error) {
    console.error('Error reading profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
} 