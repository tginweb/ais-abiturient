export default function mask(value, pattern) {
    if (value) {
        let i = 0;
        const v = value.toString();
        return pattern.replace(/#/g, _ => v[i++]);
    }
}
