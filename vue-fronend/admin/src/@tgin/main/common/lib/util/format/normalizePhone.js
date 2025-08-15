export default function normalizePhone(val, deleteCountryCode) {

  if (!val)
    return null

  if (deleteCountryCode) {
    return val.replace(/^(\+7|7|8)([0-9]{10})$/, '$2');
  } else {
    return val
  }

}

