import Hash from "../helpers/Hash";
import GenerateSalt from "../helpers/GenerateSalt";
import CheckPassword from "../helpers/CheckPassword";

function hasDuplicates(array: any[]) {
  const duplicate = array.filter((item, index) => array.indexOf(item) != index);
  duplicate.length > 0 && console.log("duplicate arrays => ", duplicate); // All duplicates
  return duplicate.length > 0;
}

test("500 SALT SHOULD BE UNIQUE", () => {
  //generate 500 salt and check if it have duplicate
  const salt_arr: string[] = [];
  for (let index = 0; index < 500; index++) {
    salt_arr.push(GenerateSalt());
  }
  expect(hasDuplicates(salt_arr)).toBeFalsy();
});

test("500 HASH WITH SAME TEXT SHOULD BE UNIQUE", () => {
  //generate password for 500 user with the same password and check if it have duplicate
  const salt_hash: String[] = [];
  for (let index = 0; index < 500; index++) {
    const salt = GenerateSalt();
    const text = "password";
    salt_hash.push(Hash(text, salt));
  }
  expect(hasDuplicates(salt_hash)).toBeFalsy();
});

test("INPUTED PASSWORD SHOULD MATCH WITH GENERATED HASH", () => {
  //check if database hash match the user input password
  const salt = GenerateSalt();
  const text = "password";
  const database_hash = Hash(text, salt);
  expect(
    CheckPassword({
      password: text,
      database_hash,
    })
  ).toBeTruthy();
});

