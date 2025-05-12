import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com'
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'Pass123!@#'
  })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
