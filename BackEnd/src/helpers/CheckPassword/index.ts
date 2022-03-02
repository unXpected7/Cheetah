import Hash from "../Hash";

const CheckPassword = ({
  password,
  database_hash,
}: {
  password: string;
  database_hash: string;
}) => {
  try {
    const [_, salt] = database_hash.split("::");
    const hashedPassword = Hash(password, salt);
    return database_hash === hashedPassword;
  } catch (error) {
    return false;
  }
};

export default CheckPassword;
