
interface PrismaUser {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

declare global {
  namespace Express{
    interface User extends PrismaUser {}
  }
}

export {}