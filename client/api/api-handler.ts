export const apiRequest = (getToken?: () => Promise<string | null>) => async (
    url: string | URL,
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH',
    body?: any
): Promise<any> => {
    
    let headers: HeadersInit = {
        'Content-Type': 'application/json'
    }

    if(getToken){
        const token = await getToken()
        headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
        }
    }
    
    const response = await fetch(url, { method, headers, body })
    
    //status:
    if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    //parse:
    let text
    try{ text = await response.text() }catch(err){
        throw new Error('Could not parse response', err as ErrorOptions) //tmp
    }
    try{ return JSON.parse(text) }catch(err){
        throw new Error(`Could not parse response to JSON. ${text}`, err as ErrorOptions) //tmp
    }

}
