export async function sendConvertFileRequest(body: FormData) {
    const request = await fetch(`${import.meta.env.VITE_BACK_URL}/convert-file`, {
        method: "POST",
        body,
    });
    return request;
}
