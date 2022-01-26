export async function wait(ms:number) {
    return new Promise(res=>{
        setTimeout(()=>{res(0)},ms);
    })
}