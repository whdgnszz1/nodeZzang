import { BadRequestException, PipeTransform, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    const isValidObjectId = Types.ObjectId.isValid(value);
    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ObjectId format');
    }
    return value;
  }
}
