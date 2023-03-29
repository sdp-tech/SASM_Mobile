import { Request } from '../../../common/requests';

export default async function FindPw(email: string): Promise<void> {
  const request = new Request();
  const response = await request.post('/users/find_pw/', {
    email: email
  });
}
