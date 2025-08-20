import { Role } from '@prisma/client';

// user.entity.ts hoặc user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string | null;
  email: string;
  imageUrl: string;
  hashedPassword: string;
  role: Role;
}
