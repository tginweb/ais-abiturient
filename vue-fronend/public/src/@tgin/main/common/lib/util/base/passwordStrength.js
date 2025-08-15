
export default function passwordStrength(pass, options) {
  return pass.test( /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
}
