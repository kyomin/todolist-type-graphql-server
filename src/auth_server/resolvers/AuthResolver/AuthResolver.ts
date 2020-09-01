import { Resolver, Query, Arg } from "type-graphql";

@Resolver(() => String)
export class AuthResolver {
  @Query((returnType) => String)
  async test(@Arg("testString") testString: string): Promise<string> {
    return testString;
  }
}
