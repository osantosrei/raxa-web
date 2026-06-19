export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export type MatchStatus = "OPEN" | "FULL" | "CANCELLED" | "FINISHED";

export interface MatchResponse {
  id: string;
  title: string;
  location: string;
  scheduledAt: string;
  maxPlayers: number;
  currentPlayers: number;
  status: MatchStatus;
  creator: UserResponse;
  inviteCode: string | null;
  createdAt: string;
}

export interface CreateMatchRequest {
  title: string;
  location: string;
  scheduledAt: string;
  maxPlayers: number;
}

export interface PlayerResponse {
  userId: string;
  name: string;
  joinedAt: string;
}

export interface InvitePreviewResponse {
  matchId: string;
  title: string;
  location: string;
  scheduledAt: string;
  maxPlayers: number;
  currentPlayers: number;
  status: MatchStatus;
  inviteCode: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  isConnectionError?: boolean;
}
