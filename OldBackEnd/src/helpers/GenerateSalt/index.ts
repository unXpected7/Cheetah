import moment from "moment";
import Crypto from "crypto";

const randomNumber = () => {
  return Math.floor(Math.random() * 9999999);
};

const GenerateSalt = () => {
  const timestamp = moment().unix();
  const salt = `${randomNumber()}${timestamp}${randomNumber()}`;
  return Crypto.createHash("sha256").update(salt).digest("hex");
};

export default GenerateSalt;
