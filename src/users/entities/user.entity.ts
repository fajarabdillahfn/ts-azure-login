import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'John Doe',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2025-01-27T02:52:50.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2025-01-27T02:52:50.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'The timestamp when the user was soft deleted',
    example: null,
    nullable: true,
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ApiProperty({
    description: 'The roles assigned to the user',
    type: () => [UserRole],
  })
  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];
}
