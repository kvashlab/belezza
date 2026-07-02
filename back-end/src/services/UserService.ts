import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        professionalProfile: true,
        addresses: true,
      },
    });

    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async updateMe(userId: string, data: any) {
    const { name, phone, cpf, avatar } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        cpf,
      },
      include: {
        clientProfile: true,
        professionalProfile: true,
        addresses: true,
      },
    });

    // Update avatar if provided
    if (avatar) {
      if (user.role === 'CLIENT' && user.clientProfile) {
        await prisma.clientProfile.update({
          where: { userId },
          data: { avatar },
        });
        user.clientProfile.avatar = avatar;
      } else if (user.role === 'PROFESSIONAL' && user.professionalProfile) {
        await prisma.professionalProfile.update({
          where: { userId },
          data: { avatar },
        });
        user.professionalProfile.avatar = avatar;
      }
    }

    return user;
  }

  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Senha atual incorreta');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async addAddress(userId: string, data: any) {
    const address = await prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });

    return address;
  }

  async removeAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address) throw new Error('Endereço não encontrado');
    if (address.userId !== userId) throw new Error('Acesso negado');

    await prisma.address.delete({ where: { id: addressId } });

    return { message: 'Endereço removido com sucesso' };
  }
}
