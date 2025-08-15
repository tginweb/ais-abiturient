export default function readFileAsync(file, as = 'readAsArrayBuffer') {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader[as](file)
    })
}
