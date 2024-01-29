'use client';
import { useSearchParams } from "next/navigation";
export default function Watch(){
    const videoPrefic='https://storage.google.apis.com/nketu-yt-processed-videos/'
    const videoSrc=useSearchParams().get('v');
    return(
        <div>
            <h1>Watch page</h1>
            <video controls src={videoPrefic+videoSrc}/>
        </div>
    );
}