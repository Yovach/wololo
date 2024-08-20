export async function sendConvertFileRequest(body: FormData) {
    const request = await fetch("http://localhost:3000/", {
        method: "POST",
        body,
    });
    return request;
}
