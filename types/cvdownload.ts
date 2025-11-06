export interface CVDownloadUser {
  _id: string;
  name: string;
  email: string;
  verified: boolean;
  downloadCount: number;
  lastDownloadAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CVDownloadRequest {
  name: string;
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}
