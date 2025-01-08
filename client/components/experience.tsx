import { useSesami_ExperienceIBForm } from '../hooks'
import { useEffect, useState } from 'react'

/*
    This is a sample page for your extension inside the Experience(instant booking form target).
    It uses CSS for styling to make it lighter, but you can use whatever tech that you want.
*/

export const Experience = () => {
    
    const Sesami = useSesami_ExperienceIBForm()
    const [ message, setMessage ] = useState<string | null>(null)

    useEffect(() => {
        if(Sesami){
            Sesami.onConfirm(async () => {
                setMessage('Doing something...')
                setTimeout(() => {
                    setMessage('Done')
                    setTimeout(() => Sesami?.acceptConfirm(), 300)
                    setTimeout(() => setMessage(null) , 2000)
                }, 2000)
            })
        }
    }, [Sesami])

    return Sesami ? (
        <div style={{
            fontSize: 18,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
        }}>

            <h3 style={{ marginTop: 0 }}>My Extension(inside iframe)</h3>

            <div>
                <a>Context from parent</a>
                <ul>
                    <li>shopId: {Sesami.getShopId()}</li>
                    <li>productId: {Sesami.getProductId()}</li>
                    <li>variantId: {Sesami.getVariantId()}</li>
                    <li>quantity: {Sesami.getQuantity()}</li>
                    <li>locale: {Sesami.getLocale()}</li>
                    <li>timezone: {Sesami.getTimezone()}</li>
                    <li>sessionId: {Sesami.getSessionId()}</li>
                </ul>
            </div>

            <p style={{ margin: 0, color: message === 'Done' ? 'green' : 'blue' }}>{message}</p>

        </div>
    ) : <></>
    
}

export default Experience
