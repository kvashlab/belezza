import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables.");
}

export class AuthService {
  async register(data: any) {
    const { email, password, name, phone, role } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || 'CLIENT',
      },
    });

    if (user.role === 'CLIENT') {
      await prisma.clientProfile.create({ data: { userId: user.id } });
    } else if (user.role === 'PROFESSIONAL') {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          username: `pro_${user.id.substring(0, 6)}`, // generate default username
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }

  async googleLogin(data: any) {
    const { email, name, role } = data;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create user with a dummy password since they use Google SSO
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || 'Google User',
          role: role || 'CLIENT',
        },
      });

      if (user.role === 'CLIENT') {
        await prisma.clientProfile.create({ data: { userId: user.id } });
      } else if (user.role === 'PROFESSIONAL') {
        await prisma.professionalProfile.create({
          data: {
            userId: user.id,
            username: `pro_${user.id.substring(0, 6)}`,
          },
        });
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  }
}
