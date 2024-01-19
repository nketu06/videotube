import {Storage} from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";
import { resolve } from 'path';
import { rejects } from 'assert';

const storage=new Storage();
const rawVideoBucketName="nketu-yt-raw-videos";
const processedVideoBucketName="nketu-yt-processed-videos"

const localRawVideoPath="./raw-videos";
const localProcessedVideoPath="./processed-videos";

export function setUpDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName:string,processedVideoName:string){
    return new Promise<void>((resolve,reject)=>{
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOption("-vf","scale=-1:360")
        .on("end",()=>{
            console.log("Processing finished sucessfully");
            resolve();
        })
        .on("error",(err)=>{
            console.log(`An error occured: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);

    });
}

export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({destination:`${localRawVideoPath}/${fileName}`});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    )
}


export async function uploadProcessedVideo(fileName: string){
    const bucket= storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`,{destination: fileName});

    console.log(
        `gs://${localProcessedVideoPath}/${fileName} downloaded to ${processedVideoBucketName}/${fileName}.`
    );
    await bucket.file(fileName).makePublic();
}


export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}


export function deleteProcessedVideo(fileName: string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


function deleteFile(filePath:string): Promise<void>{
    return new Promise((resolve,reject)=>{
        if(fs.existsSync(filePath)){
            fs.unlink(filePath,(err)=>{
                if(err){
                    console.log(`Failed to delete file at ${filePath}`,err);
                    reject(err);
                }else{
                    console.log(`File deleted at ${filePath}`);
                }
            })
        }else{
            console.log(`File not found at ${filePath}`);
            resolve();
        }
    });
}

function ensureDirectoryExistence(dirPath:string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath,{recursive:true});
        console.log(`Directory created at ${dirPath}`);
    }
}
