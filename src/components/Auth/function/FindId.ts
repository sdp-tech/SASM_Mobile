import { Request } from "../../../common/requests";

export default async function FindId(email: string): Promise<any> {
  const request = new Request();
  const response_exist = await request.post('/users/findid/', {
    email: email,
  });
  return response_exist;
}
