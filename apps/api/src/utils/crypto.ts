import bcrypt from "bcryptjs";

const PEPPER = process.env.PASSWORD_PEPPER || "defaultpepper";

export const hashPassword = async (password: string): Promise<string> => {
  const pepperedPassword = password + PEPPER;

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pepperedPassword, salt);
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const pepperedPassword = password + PEPPER;
  return bcrypt.compare(pepperedPassword, hash);
};
