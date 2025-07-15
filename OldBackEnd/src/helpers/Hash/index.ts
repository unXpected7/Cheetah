import Crypto from "crypto";

const Hash = (text: string, salt: string) => {
  const cypherText = Crypto.createHash("sha256").update(text+salt).digest("hex");
  return `${cypherText}::${salt}`;
};

export default Hash;
