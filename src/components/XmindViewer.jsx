import { Loading } from './Loading'
import { useEffect, useRef } from 'react'

const GetXmindViewer = (props) => {
    const showLoading = useRef(true)
    const { url } = props

    useEffect( () => {
        const fetchXmind = async () => {
            const {XMindEmbedViewer} = await import('xmind-embed-viewer')
            const viewer = new XMindEmbedViewer({
                el: '#xmind-container',
                region: 'cn'
            })
            viewer.setStyles({
                width: '100%',
                height: '100%'
            })
            
            const callback = () => {
                showLoading.value = false
                viewer.removeEventListener('map-ready', callback)
            }
            viewer.addEventListener('map-ready', callback)
            fetch(url)
            .then(res => res.arrayBuffer())
            .then(file => {
                viewer.load(file)
            })
            .catch(err => {
                showLoading.value = false
                console.log('加载xmind文件出错')
                viewer.removeEventListener('map-ready', callback)
            })
        }
        fetchXmind()
    }, [])

    return (
            <div id="xmind-container">
            </div>
    )
}

export function XmindViewer({ url }) {
    
    return (
            <div className="xmind-container">
                <GetXmindViewer url={url}/>
            </div>
    )
}
