import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl= httpsCallable(functions,'generateUploadUrl');
const getVideoFunction= httpsCallable(functions,'getVideos');

export interface Video{
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing"|"processed",
    title?: string,
    description?: string
}

export async function uploadVideo(file:File){
    const response: any = await generateUploadUrl({
        FileExtension: file.name.split('.').pop()
         
    });
         // upload the file via the signed URL
    const uploadResult = await fetch(response?.data?.url,{
        method: 'PUT',
        body: file,
        headers:{
            'Content-Type' : file.type
        }
    });
    return uploadResult;
}

export async function getVideos() {
    const response = await getVideoFunction();
    return response.data as Video[];
}