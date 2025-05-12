import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  expiry_date: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
