export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}
