const fs = require('fs');
const path = require('path');

interface Actor {
  userkey: string;
  avatar: string;
  name: string;
  username: string;
  description: string;
  score: number;
  scoreXpMultiplier: number;
  profileId: number;
  primaryAddress: string;
}

interface Profile {
  id: number;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  invitesAvailable: number;
  invitedBy: number;
  actor: Actor;
  inviterActor: Actor;
}

async function fetchProfiles(offset: number, limit: number) {
  const response = await fetch(`https://api.ethos.network/api/v1/profiles/directory?limit=${limit}&offset=${offset}`, {
    headers: {
      'accept': '*/*',
      'content-type': 'application/json',
      'x-ethos-service': 'web'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  return response.json();
}

async function downloadAllProfiles() {
  const limit = 100;
  const totalProfiles = 3790;
  const profiles: Profile[] = [];
  
  console.log('开始下载数据...');
  
  for (let offset = 0; offset < totalProfiles; offset += limit) {
    console.log(`正在下载 ${offset} 到 ${offset + limit} 条数据...`);
    const response = await fetchProfiles(offset, limit);
    profiles.push(...response.data.values);
    
    // 每下载100条数据保存一次
    if (profiles.length % 1000 === 0 || offset + limit >= totalProfiles) {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }
      
      fs.writeFileSync(
        path.join(dataDir, 'profiles.json'),
        JSON.stringify(profiles, null, 2)
      );
      console.log(`已保存 ${profiles.length} 条数据`);
    }
  }
  
  console.log('数据下载完成！');
}

downloadAllProfiles().catch(console.error); 