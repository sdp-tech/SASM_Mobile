import { Request } from "../../../common/requests";

export interface formProps {
  code: string;
  password: string;
  passwordConfirm: string;
}

export default async function ChangePw(form: formProps): Promise<any> {
  const request = new Request();
  if (form.code && form.password) {
    const response = await request.put('/users/pw_reset/', {
      code: form.code,
      password: form.password,
    });
    return response;
  }
}