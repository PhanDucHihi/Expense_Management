export type Wallet = {
  id: number;
  name: string;
  balance: number;
  type: WalletType;
  startAmount?: number;
  targetAmount?: number;
  deadline?: string;
  userId: number;
};

export enum WalletType {
  BASIS,
  GOAL,
}
