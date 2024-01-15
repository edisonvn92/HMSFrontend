export interface IAuthUser {
  AuthenticationResult: {
    AccessToken: string;
    ExpiredTime: number;
    ExpriredIn: number;
    IdToken: string;
    RefreshToken: string;
  };
  ChallengeParameters: object;
}
