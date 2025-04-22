export interface Actor {
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

export interface Profile {
  id: number;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  invitesAvailable: number;
  invitedBy: number;
  actor: Actor;
  inviterActor: Actor;
}

export interface ApiResponse {
  ok: boolean;
  data: {
    values: Profile[];
    limit: number;
    offset: number;
    total: number;
  };
} 