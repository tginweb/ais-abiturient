import {
    IsEmail,
    IsNumber,
    IsDefined,
    IsString,
    IsObject,
    IsPhoneNumber,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsBoolean
} from 'class-validator';
import { validatorMessageBuilder as message } from '~lib/validator/message-builder'

export class UpdateOrderAddressAndContactsDto {

    @IsNotEmpty({message: message('@validate.FIELD_REQUIRED')})
    public addressReg: string;

    @IsOptional()
    public addressLive: string;

    @IsBoolean({message: message('@validate.FIELD_WRONG_FORMAT')})
    public addressEqual: boolean;

    @IsNotEmpty({message: message('@validate.FIELD_REQUIRED')})
    @IsPhoneNumber('RU', {message: message('@validate.FIELD_WRONG_FORMAT')})
    public phone: string;

    @IsNotEmpty({message: message('@validate.FIELD_REQUIRED')})
    @IsPhoneNumber('RU', {message: message('@validate.FIELD_WRONG_FORMAT')})
    @IsOptional()
    public phone2: string;

    @IsNotEmpty({message: message('@validate.FIELD_REQUIRED')})
    @IsEmail({}, {message: message('@validate.FIELD_WRONG_FORMAT')})
    public email: string;


}
