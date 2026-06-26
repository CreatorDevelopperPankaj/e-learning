import { RoleEnum } from '../enums/role.enum';

export interface RoleModel {
  id: string;
  name: RoleEnum | string;
}
