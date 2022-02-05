export async function wait(ms) {
    return new Promise(res => {
        setTimeout(() => { res(0); }, ms);
    });
}
