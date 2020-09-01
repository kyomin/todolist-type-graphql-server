import { BaseEntity, BeforeInsert, BeforeUpdate } from "typeorm";
import { validateOrReject } from "class-validator";

export abstract class Validation extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
