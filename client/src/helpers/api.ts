interface AvailableFormatsResponse {
    formats: Array<string>;
}

export async function getAvailableFormats(): Promise<Array<string>> {
    const request = await fetch("http://localhost:3000/available-formats");
    if (!request.ok) {
        return [];
    }

    const result: AvailableFormatsResponse = await request.json();
    if (!("formats" in result)) {
        throw new Error("Invalid response data!")
    }

    return result.formats;
}
