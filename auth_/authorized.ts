export const isAuthorized = async (
  _args: {
    user: string;
    token: string;
    system: string;
    resource: string;
    actions: string;
  },
) => {
  return await true;
};
