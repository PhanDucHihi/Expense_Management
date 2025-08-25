export type Wallet = {
  id: number;
  name: string;
  balance: number;
  type: WalletType;
  targetAmount?: number;
  deadline?: string;
  userId: number;
};

export enum WalletType {
  BASIS = "BASIS",
  GOAL = "GOAL",
}
