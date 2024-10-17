// handler({ httpMethod: "GET" } as any, {} as any);

import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_JxHuCsxO7",
      userPoolClientId: "3tfedgp6f587aieo7malg7vhr9",
    },
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInOutput;
  }

  /**
   * call only after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }
}

const service = new AuthService();
service.login("jadinukadilshan@gmail.com", "DwnkpO@1998").then(async () => {
  const t = await service.getIdToken();
  console.log(t);
});
