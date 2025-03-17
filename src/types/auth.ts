
import { User } from "firebase/auth";

export type UserData = {
  email: string;
  displayName?: string;
  coins: number;
  miningRate: number;
  lastMined?: string;
  createdAt: string;
  level: number;
  rank?: string;
}

export type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  generateOTP: (email: string, isRegistration: boolean) => Promise<boolean>;
  verifyOTP: (email: string, otp: string, isRegistration: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
};

export const defaultUserData: UserData = {
  email: "",
  coins: 0,
  miningRate: 5,
  createdAt: new Date().toISOString(),
  level: 1,
  rank: "Bronze"
};
