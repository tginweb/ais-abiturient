export default function checkDateEmpty(val) {
    return !val || !val.match(/\d/)
}
