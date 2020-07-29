import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, 10);

export default hashPassword;
