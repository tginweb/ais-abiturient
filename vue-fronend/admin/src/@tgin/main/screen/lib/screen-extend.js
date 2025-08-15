export default function (screen) {

    const result = {
        ...screen,
        mobile: screen.lt.sm,
        tablet: screen.gt.xs && screen.lt.md,
        desktop: screen.gt.sm
    }

    return result
}
